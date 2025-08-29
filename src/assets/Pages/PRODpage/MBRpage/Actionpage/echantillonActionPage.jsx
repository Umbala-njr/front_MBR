import React, { useEffect, useState } from 'react';
import ListeEchantillonsAction from '../../../../composant/Mbr/Action/echantillonAction';


const EchantillonactionPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ListeEchantillonsAction/>
      </div>
    </div>
  );
};

export default EchantillonactionPage;