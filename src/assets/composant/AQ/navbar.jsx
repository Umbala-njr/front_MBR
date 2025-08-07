import React from 'react';

const ProfessionalNavbar = () => {
  return (
    <nav className="w-full bg-gradient-to-b from-emerald-700/95 to-emerald-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo Container */}
          <div className="flex items-center justify-center w-full">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-white animate-pulse">BIONE</span>
              <span className="text-green-700 animate-bounce">XX</span>
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;