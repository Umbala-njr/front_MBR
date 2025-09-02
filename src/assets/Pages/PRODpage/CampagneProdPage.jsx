import React, { useEffect, useState } from 'react';
import CampagneProd from '../../composant/production/campagneProduction';


const CampagneprodPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <CampagneProd/>
      </div>
    </div>
  );
};

export default CampagneprodPage;