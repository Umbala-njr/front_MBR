import React, { useEffect, useState } from 'react';
import CampagneCards from '../../composant/AQ/campagneAq';

const CampagneCardPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <CampagneCards/>
      </div>
    </div>
  );
};

export default CampagneCardPage;