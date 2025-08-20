import React, { useEffect, useState } from 'react';
import ProduitManager from '../../composant/AQ/Produit';


const ProduitPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ProduitManager/>
      </div>
    </div>
  );
};

export default ProduitPage;
