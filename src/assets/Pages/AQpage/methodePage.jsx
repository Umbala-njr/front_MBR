import React, { useEffect, useState } from 'react';
import MethodeManager from '../../composant/AQ/methode';


const MethodePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <MethodeManager/>
      </div>
    </div>
  );
};

export default MethodePage;