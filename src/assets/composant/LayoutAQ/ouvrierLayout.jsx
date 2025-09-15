// src/layouts/MainLayout.jsx
import React from "react";
import NavbarOuvrier from "../production/Ouvrier/navbarOuvrier";
import { Outlet } from "react-router-dom";

const OuvrierLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-900 to-emerald-800">
      {/* Navbar */}
      <NavbarOuvrier />

      {/* Contenu principal */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-white overflow-auto">
        <div className="max-w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900/90 border-t border-emerald-700/50 text-center text-emerald-200 py-3 text-sm">
        © {new Date().getFullYear()} Gestion MBR - Tous droits réservés
      </footer>
    </div>
  );
};

export default OuvrierLayout;