import React, { useEffect, useState } from 'react';
import ListeEchantillons from '../../../../composant/Mbr/Affichage/echantillonAffiche';


const EchantillonaffichePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ListeEchantillons/>
      </div>
    </div>
  );
};

export default EchantillonaffichePage;