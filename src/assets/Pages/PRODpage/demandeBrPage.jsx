import React, { useEffect, useState } from 'react';
import DemandeComponent from '../../composant/production/demandeBr';

const DemandeBrPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <DemandeComponent/>
      </div>
    </div>
  );
};

export default DemandeBrPage;