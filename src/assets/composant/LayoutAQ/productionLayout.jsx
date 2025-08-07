import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "../production/navbar";

const NavbarLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar en haut */}
      <NavbarComponent />

      {/* Contenu central injecté via <Outlet /> */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default NavbarLayout;
