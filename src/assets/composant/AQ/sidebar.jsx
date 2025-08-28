import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import imageAQ from '../../photos/AQ MBR Management (1).png';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; 

// Composant FabricationDropdown adapté pour le sidebar
const FabricationDropdown = ({ isOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const menuId = 'fabrication-menu';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggle = () => setDropdownOpen((v) => !v);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => { if (!isOpen) setDropdownOpen(true); }}
      onMouseLeave={() => { if (!isOpen) setDropdownOpen(false); }}
    >
      {/* Bouton déclencheur */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        aria-controls={menuId}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
        className={`
          w-full text-left
          flex items-center py-3 px-4
          rounded-xl 
          transition-all duration-200 ease-in-out
          group
          text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md
          ${!isOpen && 'justify-center'}
        `}
      >
        <div className="relative">
          <svg
            className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5h6m-6 7h6m-6 7h6M4 5h.01M4 12h.01M4 19h.01"
            />
          </svg>
        </div>
        {isOpen && (
          <>
            <span className="ml-4 font-medium transition-all duration-200">
              Fabrication
            </span>
            <svg 
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {/* Menu ouvert - mode sidebar élargie */}
      {dropdownOpen && isOpen && (
        <div
          id={menuId}
          role="menu"
          className="ml-6 mt-1 space-y-1 border-l-2 border-white/20 pl-4 overflow-hidden"
        >
          {[
            { label: 'Matière végétale', to: '/AQ/produit' },
            { label: 'Atelier', to: '/AQ/atelier' },
            { label: 'Document', to: '/AQ/document' },
            { label: 'Echantillon', to: '/AQ/Mechant' },
            { label: 'Fiche matière', to: '/AQ/fabmatiere' },
            { label: 'Autre Methodes', to: '/AQ/methodefab' },
          ].map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              role="menuitem"
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`
              }
              onClick={() => setDropdownOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Menu flyout - mode sidebar réduite */}
      {dropdownOpen && !isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-full top-0 ml-3 w-64 p-3 rounded-xl shadow-2xl bg-gradient-to-br from-emerald-800/95 to-emerald-900/95 border border-white/10 backdrop-blur-md z-50"
        >
          <div className="mb-2 px-2 text-sm font-semibold text-white/90">Fabrication</div>
          <div className="space-y-1 pr-1">
            {[
              { label: 'Matière végétale', to: '/AQ/produit' },
              { label: 'Atelier', to: '/AQ/atelier' },
              { label: 'Document', to: '/AQ/document' },
              { label: 'Echantillon', to: '/AQ/Mechant' },
              { label: 'Autre Methodes', to: '/AQ/methodefab' },
            ].map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                role="menuitem"
                className={({ isActive }) =>
                  `block w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                      : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                  }`
                }
                onClick={() => setDropdownOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/utilisateur/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('token');
      navigate("/");
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.get("http://localhost:3000/api/utilisateur/profil", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      });
    }
  }, []);

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-emerald-500/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-emerald-600/90 transition-all duration-200"
      >
        <span className="text-white font-medium">
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Sidebar pour desktop */}
      <aside 
        className={`
          fixed top-0 left-0 h-full 
          flex flex-col justify-between
          bg-gradient-to-b from-emerald-700/95 to-emerald-900/95
          backdrop-blur-md
          border-r border-emerald-400/20
          shadow-2xl
          transition-all duration-300 ease-in-out
          overflow-visible
          z-40
          ${isOpen ? 'w-72' : 'w-20'}
          ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
        `}
      >
        {/* Bouton de toggle pour desktop */}
        <div className="relative">
          <button 
            onClick={toggleSidebar}
            className={`
              absolute z-20 top-4 
              text-white/80 hover:text-white 
              hover:bg-white/10 
              p-2 rounded-full 
              transition-all duration-200
              flex items-center justify-center
              ${isOpen ? 'right-5' : 'right-2'}
            `}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isOpen 
                  ? "M15 19l-7-7 7-7"  // ← vers la gauche
                  : "M9 5l7 7-7 7"     // → vers la droite
                } 
              />
            </svg>
          </button>

          {/* Logo Section */}
          <div className="pt-10 pb-6 text-center border-b border-white/10">
            <div className="group relative flex items-center justify-center">
              <div className="absolute w-full h-full bg-emerald-500/20 rounded-full 
                animate-pulse-slow"></div>
              
              <img  
                className={`mx-auto transition-all duration-300 ease-in-out filter drop-shadow-2xl border-4 border-white/30 rounded-full relative z-10 group-hover:scale-110 group-hover:rotate-3 ${isOpen ? 'w-36' : 'w-12'}`} 
                src={imageAQ} 
                alt="Logo"  
              />
            </div>
            
            {isOpen && (
              <div className="mt-4 opacity-90 space-y-1">
                <h2 className="text-white font-semibold text-lg tracking-wider">
                  AQ Management
                </h2>
                <p className="text-emerald-100/70 text-sm uppercase tracking-wider">
                  Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-0 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)] no-scrollbar">
          <NavLink
            to="/AQ/home"
            className={({ isActive }) => `
              flex items-center py-3 px-4
              rounded-xl 
              transition-all duration-200 ease-in-out
              group
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                : 'text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <div className="relative">
              <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            {isOpen && (
              <span className="ml-4 font-medium transition-all duration-200">
                Dashboard
              </span>
            )}
          </NavLink>

          <NavLink
            to="/AQ/mbr1"
            className={({ isActive }) => `
              flex items-center py-3 px-4
              rounded-xl 
              transition-all duration-200 ease-in-out
              group
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                : 'text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <div className="relative">
              <svg
                className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2v2m0-2h7a2 2 0 012 2v10a2 2 0 01-2 2h-7m0-14H5a2 2 0 00-2 2v10a2 2 0 002 2h7"/>
              </svg>
            </div>
            {isOpen && (
              <span className="ml-4 font-medium transition-all duration-200">
                Master Batch Record
              </span>
            )}
          </NavLink>

          {/* Composant FabricationDropdown intégré */}
          <FabricationDropdown isOpen={isOpen} />

           <NavLink
            to="/AQ/etape"
            className={({ isActive }) => `
              flex items-center py-3 px-4
              rounded-xl 
              transition-all duration-200 ease-in-out
              group
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                : 'text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <div className="relative">
              <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
              </svg>
            </div>
            {isOpen && (
              <span className="ml-4 font-medium transition-all duration-200">
                Etape
              </span>
            )}
          </NavLink>

          <NavLink
            to="/AQ/utilisateur"
            className={({ isActive }) => `
              flex items-center py-3 px-4
              rounded-xl 
              transition-all duration-200 ease-in-out
              group
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                : 'text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <div className="relative">
              <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {isOpen && (
              <span className="ml-4 font-medium transition-all duration-200">
                Utilisateur
              </span>
            )}
          </NavLink>

         

          <NavLink
            to="/AQ/historique"
            className={({ isActive }) => `
              flex items-center py-3 px-4
              rounded-xl 
              transition-all duration-200 ease-in-out
              group
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10' 
                : 'text-emerald-50/90 hover:bg-white/10 hover:text-white hover:shadow-md'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <div className="relative">
              <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-9-9"/>
              </svg>
            </div>
            {isOpen && (
              <span className="ml-4 font-medium transition-all duration-200">
                Historique
              </span>
            )}
          </NavLink>
        </nav>

        {/* Profil utilisateur */}
        {user && (
          <div className="p-4 bg-gradient-to-t from-emerald-700/90 to-transparent backdrop-blur-sm border-t border-white/10">
            <div className={`flex items-center justify-between ${!isOpen && 'flex-col gap-2'}`}>
              {/* Avatar + Infos */}
              <div className="flex items-center">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 shadow-lg"
                    src={`http://localhost:3000/uploads/photos/${user.photo}`}
                    alt="Avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/80"></div>
                </div>
                {isOpen && (
                  <div className="ml-4">
                    <p className="text-white font-semibold text-sm">{user.nom_uti}</p>
                    <p className="text-emerald-100/70 text-xs">Connecté</p>
                  </div>
                )}
              </div>

              {/* Bouton déconnexion */}
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                title="Déconnexion"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-200"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Sidebar;