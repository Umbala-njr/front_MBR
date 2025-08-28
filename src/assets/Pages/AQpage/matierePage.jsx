import React, { useEffect, useState } from 'react';
import MatiereManager from '../../composant/AQ/matiere/matiere';



const MatierePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <MatiereManager/>
      </div>
    </div>
  );
};

export default MatierePage;
