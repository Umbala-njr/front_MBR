import React, { useEffect, useState } from 'react';
import ListeEchantillonsOuvrier from '../../composant/production/Ouvrier/echantillionOuvrier';


const ListeEchantillonsOuvrierPage= () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        < ListeEchantillonsOuvrier/>
      </div>
    </div>
  );
};

export default  ListeEchantillonsOuvrierPage ;
