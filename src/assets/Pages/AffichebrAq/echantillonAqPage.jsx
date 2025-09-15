import React, { useEffect, useState } from 'react';
import ListeEchantillonsAQ from '../../composant/AQ/AfficheMbr/echantillionA';


const EchantillonAQBRPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        < ListeEchantillonsAQ/>
      </div>
    </div>
  );
};

export default EchantillonAQBRPage;