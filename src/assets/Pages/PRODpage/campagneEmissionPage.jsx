import React, { useEffect, useState } from 'react';
import CampagneEmission from '../../composant/production/campagneEmission';


const CampagneEmiPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <CampagneEmission/>
      </div>
    </div>
  );
};

export default CampagneEmiPage;