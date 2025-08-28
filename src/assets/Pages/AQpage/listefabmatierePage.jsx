import React, { useEffect, useState } from 'react';
import FabricationMATList from '../../composant/AQ/matiere/listefabmatiere';



const FabmatierePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <FabricationMATList/>
      </div>
    </div>
  );
};

export default FabmatierePage;
