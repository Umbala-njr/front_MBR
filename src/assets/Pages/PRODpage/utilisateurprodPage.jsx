import React, { useEffect, useState } from 'react';
import UtilisateurProdManager from '../../composant/production/utilisateurProd';


const UtilisateurprodPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <UtilisateurProdManager/>
      </div>
    </div>
  );
};

export default UtilisateurprodPage;