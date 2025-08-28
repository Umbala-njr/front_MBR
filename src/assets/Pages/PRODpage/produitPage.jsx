import React, { useEffect, useState } from 'react';
import ProduitList from '../../composant/production/produit';


const ProduitprodPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
            <ProduitList/>
      </div>
    </div>
  );
};

export default ProduitprodPage;