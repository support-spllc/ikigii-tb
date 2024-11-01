import React from 'react';
import PhotoProcessor from './components/photoProcessor';
import './index.css';


function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">IKIGII BITCONF</h1>
        <p className="text-lg text-gray-500 mt-2">Agrega tus datos y te mandamos tu foto!</p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <PhotoProcessor />
      </main>
      
      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; 2024 IKIGII by TowerBank
      </footer>
    </div>
  );
}

export default App;
