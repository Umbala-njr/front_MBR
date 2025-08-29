import React, { useEffect, useState } from 'react';
import EtapeByMBR from '../../../../composant/Mbr/Affichage/etapeAffiche';



const EtapebymbrPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <EtapeByMBR/>
      </div>
    </div>
  );
};

export default EtapebymbrPage;