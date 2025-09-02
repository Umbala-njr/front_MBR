import React, { useEffect, useState } from 'react';
import CampagneManager from '../../composant/production/campagne';

const CampagnePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <CampagneManager/>
      </div>
    </div>
  );
};

export default CampagnePage;