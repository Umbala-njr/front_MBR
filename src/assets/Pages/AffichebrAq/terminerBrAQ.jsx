import React, { useEffect, useState } from 'react';
import TerminerMBRListAQ from '../../composant/AQ/AfficheMbr/mbrterminer';


const TerminerMBRListAQPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <TerminerMBRListAQ/>
      </div>
    </div>
  );
};

export default TerminerMBRListAQPage;