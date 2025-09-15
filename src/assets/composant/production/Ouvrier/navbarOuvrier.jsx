import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiSettings, FiMenu, FiX } from "react-icons/fi";
import imageAQ from '../../../photos/AQ MBR Management (1).png';
import axios from "axios";

const NavbarOuvrier = () => {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/api/utilisateur/profil", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error("Erreur récupération user :", err));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/utilisateur/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-emerald-900/95 backdrop-blur-md shadow-lg border-b border-emerald-700/30 sticky top-0 z-50">
      <div className="max-w-full + px-6 mx-auto  sm:px-6 lg:px-8  h-16 md:h-20 lg:h-24">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo + Titre */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img
              src={imageAQ}
              className="h-12 w-12 lg:h-14 lg:w-14 object-contain border-2 border-emerald-400/20 rounded-full p-1"
              alt="AQ MBR Management"
            />
            <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text ">
              Gestion MBR
            </h1>
          </div>

          {/* Menu mobile */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-emerald-100 hover:text-white p-2 rounded-lg bg-emerald-800/50 hover:bg-emerald-700/50 transition-colors"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>

          {/* Profil utilisateur (desktop) */}
          {user && (
            <div className="hidden lg:block relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 bg-emerald-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-600/30 hover:border-emerald-400/50 hover:bg-emerald-700/60 transition-all duration-200 group"
              >
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400/20 group-hover:ring-emerald-400/40 transition-all duration-200"
                  src={`http://localhost:3000/uploads/photos/${user.photo}`}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.nom_uti}&background=047857&color=ffffff&bold=true`;
                  }}
                />
                <span className="text-white font-medium text-sm">{user.nom_uti}</span>
              </button>

              {/* Menu utilisateur */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-emerald-100">
                    <p className="text-sm font-semibold text-emerald-900">{user.nom_uti}</p>
                    <p className="text-xs text-emerald-600 mt-1">{user.email}</p>
                  </div>
                  
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50 transition-colors"
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    Mon profil
                  </a>
                  
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50 transition-colors"
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Paramètres
                  </a>
                  
                  <div className="border-t border-emerald-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu mobile ouvert */}
        {isMobileMenuOpen && user && (
          <div className="lg:hidden bg-emerald-800/95 backdrop-blur-md rounded-lg mt-2 p-4 border border-emerald-700/30 animate-slideDown">
            <div className="flex items-center space-x-3 pb-3 border-b border-emerald-700/30 mb-3">
              <img
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400/30"
                src={`http://localhost:3000/uploads/photos/${user.photo}`}
                alt="Avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.nom_uti}&background=047857&color=ffffff&bold=true`;
                }}
              />
              <div>
                <p className="text-sm font-semibold text-white">{user.nom_uti}</p>
                <p className="text-xs text-emerald-200">{user.email}</p>
              </div>
            </div>
            
            <a
              href="/profile"
              className="flex items-center py-2 text-sm text-emerald-100 hover:text-white hover:bg-emerald-700/50 px-2 rounded-lg transition-colors mb-1"
            >
              <FiUser className="mr-3 h-4 w-4" />
              Mon profil
            </a>
            
            <a
              href="/settings"
              className="flex items-center py-2 text-sm text-emerald-100 hover:text-white hover:bg-emerald-700/50 px-2 rounded-lg transition-colors mb-1"
            >
              <FiSettings className="mr-3 h-4 w-4" />
              Paramètres
            </a>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-2 text-sm text-red-300 hover:text-red-100 hover:bg-red-900/30 px-2 rounded-lg transition-colors mt-2"
            >
              <FiLogOut className="mr-3 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* Overlay pour menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Overlay pour menu utilisateur */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:block hidden"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavbarOuvrier;