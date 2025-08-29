import React, { useEffect, useState } from 'react';
import EncoursMBRList from '../../../composant/production/encours';


const EncoursBRPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <EncoursMBRList/>
      </div>
    </div>
  );
};

export default EncoursBRPage;