import React, { useEffect, useState } from 'react';
import FabricationProdList from '../../composant/production/production';


const ProductionPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <FabricationProdList/>
      </div>
    </div>
  );
};

export default ProductionPage;