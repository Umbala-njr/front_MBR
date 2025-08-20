import React, { useEffect, useState } from 'react';
import ModeleEchantillon from '../../composant/AQ/modeleechan';

const ModeleechanPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ModeleEchantillon/>
      </div>
    </div>
  );
};

export default ModeleechanPage;