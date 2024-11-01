import React, { useRef, useState } from 'react';

const PhotoProcessor = () => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [logoColor, setLogoColor] = useState('blue'); // New state for logo color
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        imagen: null,
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const processImage = async (file) => {
        return new Promise((resolve, reject) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const mainImage = new Image();
            mainImage.onload = () => {
                console.log("Main image loaded successfully.");
                canvas.width = mainImage.width;
                canvas.height = mainImage.height;
                ctx.drawImage(mainImage, 0, 0);

                const logo = new Image();
                logo.crossOrigin = "anonymous"; // Ensure cross-origin access

                // Select logo based on chosen color
                switch (logoColor) {
                    case 'negro':
                        logo.src = `${window.location.origin}/Logo-negro.png`;
                        break;
                    case 'blanco':
                        logo.src = `${window.location.origin}/Logo-blanco.png`;
                        break;
                    case 'azul':
                    default:
                        logo.src = `${window.location.origin}/Logo-azul.png`;
                        break;
                }

                logo.onload = () => {
                    console.log("Logo loaded successfully.");
                    const logoWidth = mainImage.width * 0.2;
                    const logoHeight = (logoWidth * logo.height) / logo.width;
                    const x = mainImage.width - logoWidth - (mainImage.width * 0.05);
                    const y = mainImage.height - logoHeight - (mainImage.height * 0.05);

                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
                    ctx.globalAlpha = 1.0;

                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };

                logo.onerror = (err) => {
                    console.error("Error loading logo image:", err);
                    reject("Error loading logo image.");
                };
            };

            mainImage.onerror = (err) => {
                console.error("Error loading main image:", err);
                reject("Error loading main image.");
            };

            const reader = new FileReader();
            reader.onload = (e) => (mainImage.src = e.target.result);
            reader.onerror = (err) => {
                console.error("Error reading uploaded file:", err);
                reject("Error reading uploaded file.");
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imagen) {
            alert('Please select an image');
            return;
        }

        setLoading(true);
        try {
            const processedImage = await processImage(formData.imagen);

            const filename = `${formData.nombre}_${formData.apellido}_${formData.email}.jpg`
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9._@-]/g, '');

            const link = document.createElement('a');
            link.href = processedImage;
            link.download = filename;
            link.click();

            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                imagen: null,
            });
            e.target.reset();

        } catch (error) {
            console.error('Processing error:', error);
            alert('There was an error processing your image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">Nombre</label>
                    <input
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-600">Apellido</label>
                    <input
                        id="apellido"
                        name="apellido"
                        required
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="logoColor" className="block text-sm font-medium text-gray-600">Logo Color</label>
                    <select
                        id="logoColor"
                        value={logoColor}
                        onChange={(e) => setLogoColor(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="azul">Blue</option>
                        <option value="negro">Black</option>
                        <option value="blanco">White</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="imagen" className="block text-sm font-medium text-gray-600">Upload Photo</label>
                    <input
                        id="imagen"
                        name="imagen"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 mt-4 font-semibold rounded-lg text-white ${
                        loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="loader border-t-2 border-white border-solid rounded-full w-5 h-5 mr-2 animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        'Process & Download'
                    )}
                </button>
            </form>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default PhotoProcessor;
