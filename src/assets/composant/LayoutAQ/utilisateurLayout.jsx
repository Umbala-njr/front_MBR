import { Outlet } from "react-router-dom";
import Sidebar from "../AQ/sidebar";
import React, { useState, useEffect } from 'react';
import ProfessionalNavbar from "../AQ/navbar";

const DashboardAQ = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Sur mobile, fermer automatiquement le sidebar si ouvert
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Appel initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar avec position fixe */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isMobile={isMobile} 
      />
      
      {/* Contenu principal qui s'adapte à la largeur */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Navbar fixe qui s'adapte à la largeur disponible */}
        <div className={`
          fixed top-0 right-0 z-20 
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? 'left-0' 
            : isSidebarOpen 
              ? 'left-72' 
              : 'left-20'
          }
        `}>
          <ProfessionalNavbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        {/* Zone de contenu principal qui s'étend sur toute la largeur disponible */}
        <main className={`
          flex-1 min-h-screen
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? 'ml-0 pt-16' 
            : isSidebarOpen 
              ? 'ml-72 pt-16' 
              : 'ml-20 pt-16'
          }
        `}>
          {/* Container centré pour tous les éléments Outlet */}
          <div className="w-full h-full flex flex-col items-center justify-start">
            {/* Zone de contenu avec padding et largeur maximale */}
            <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Overlay pour mobile quand sidebar est ouvert */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-15"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardAQ;