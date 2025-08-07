import React, { useEffect, useState } from 'react';

import FabricationManager from '../../composant/AQ/Fabrication';

const FabricationPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Détecte si l'écran est mobile (pour cacher le menu latéral fixe)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex">
      

      <div>
        <FabricationManager/>
      </div>
    </div>
  );
};

export default FabricationPage;
