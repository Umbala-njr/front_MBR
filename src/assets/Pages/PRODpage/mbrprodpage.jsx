import React, { useEffect, useState } from 'react';
import MBRProdList from '../../composant/production/mbrProd';


const MBRProdPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <MBRProdList/>
      </div>
    </div>
  );
};

export default MBRProdPage;