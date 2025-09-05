import React, { useEffect, useState } from 'react';
import TerminerMBRList from '../../composant/production/terminerBR';


const TerminerBrPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
            <TerminerMBRList/>
      </div>
    </div>
  );
};

export default TerminerBrPage;