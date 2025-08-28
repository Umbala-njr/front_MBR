import React, { useEffect, useState } from 'react';
import MatiereafficheManager from '../../../../composant/Mbr/Affichage/matiereAffiche';



const MatiereaffichePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <MatiereafficheManager/>
      </div>
    </div>
  );
};

export default MatiereaffichePage;