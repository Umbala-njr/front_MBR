import React, { useEffect, useState } from 'react';
import HistoriqueProd from '../../composant/production/historiqueProd';


const HistoriqueprodPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <HistoriqueProd/>
      </div>
    </div>
  );
};

export default HistoriqueprodPage;