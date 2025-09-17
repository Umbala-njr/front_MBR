import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiUser, FiSettings, FiBell } from "react-icons/fi";
import imageAQ from '../../photos/AQ MBR Management (1).png';
import axios from "axios";

const NavbarComponent = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Récupérer les informations de l'utilisateur
      axios.get("http://localhost:3000/api/utilisateur/profil", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error("Erreur récupération user :", err));
      
      // Récupérer le nombre de notifications
      fetchNotificationCount(token);
    }
  }, []);

  const fetchNotificationCount = (token) => {
    axios.get("http://localhost:3000/api/campagne/affichebystatut/Emission", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setNotificationCount(res.data.length);
    })
    .catch(err => {
      console.error("Erreur récupération notifications :", err);
    });
  };

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

  const navigationLinks = [
    { label: "Tableau de bord", href: "/das" },
    { label: "Production", href: "/PROD/campagneProduit" },
    { label: "Utilisateur", href: "/PROD/utilisateurProd" },
    { label: "Historique", href: "/PROD/historiqueProd" },
    { label: "Campagne", href: "/PROD/produit" },
    { 
      label: "Notification", 
      href: "/PROD/campagneEmission",
      hasNotification: true
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-emerald-950/95 backdrop-blur-sm shadow-lg border-b border-emerald-800/30 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo et marque */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center">
              <img
                src={imageAQ}
                className="h-15 w-15 sm:h-14 sm:w-14 object-contain border-2 border-emerald-400/30 rounded-full"
                alt="AQ MBR Management"
              />
              <div className="ml-3">
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight">
                  PROD MBR
                </span>
                <div className="text-emerald-200 text-xs font-medium hidden sm:block">
                  Management
                </div>
              </div>
            </div>
          </div>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative text-emerald-100 hover:text-white hover:bg-emerald-800/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
              >
                {link.label}
                {link.hasNotification && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Section utilisateur et menu mobile */}
          <div className="flex items-center space-x-3">
            
            {/* Profil utilisateur */}
            {user && (
              <div className="relative hidden sm:block">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 bg-gradient-to-r from-emerald-800/60 to-emerald-700/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-emerald-600/30 hover:border-emerald-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-emerald-400/30 group-hover:ring-emerald-400/50 transition-all duration-200"
                        src={`http://localhost:3000/uploads/photos/${user.photo}`}
                        alt="Avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${user.nom_uti}&background=047857&color=ffffff`;
                        }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-950"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-white font-semibold text-sm leading-tight">{user.nom_uti}</p>
                      <p className="text-emerald-200/80 text-xs">En ligne</p>
                    </div>
                  </div>
                </button>

                {/* Menu déroulant utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.nom_uti}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      Mon profil
                    </a>
                    
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiSettings className="mr-3 h-4 w-4" />
                      Paramètres
                    </a>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Avatar mobile (si utilisateur connecté) */}
            {user && (
              <div className="sm:hidden">
                <img
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400/30"
                  src={`http://localhost:3000/uploads/photos/${user.photo}`}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.nom_uti}&background=047857&color=ffffff`;
                  }}
                />
              </div>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-emerald-900/95 backdrop-blur-sm border-t border-emerald-800/30">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="relative flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-lg text-base font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
                {link.hasNotification && notificationCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </a>
            ))}
            
            {user && (
              <div className="border-t border-emerald-800/30 mt-4 pt-4 space-y-2">
                <div className="flex items-center px-4 py-2">
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400/30"
                    src={`http://localhost:3000/uploads/photos/${user.photo}`}
                    alt="Avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${user.nom_uti}&background=047857&color=ffffff`;
                    }}
                  />
                  <div className="ml-3">
                    <p className="text-white font-semibold text-sm">{user.nom_uti}</p>
                    <p className="text-emerald-200/80 text-xs">En ligne</p>
                  </div>
                </div>
                
                <a
                  href="/profile"
                  className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-all duration-200"
                >
                  <FiUser className="mr-3 h-5 w-5" />
                  Mon profil
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center px-4 py-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-all duration-200"
                >
                  <FiSettings className="mr-3 h-5 w-5" />
                  Paramètres
                </a>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;