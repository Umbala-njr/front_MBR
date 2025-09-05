import React, { useEffect, useState } from 'react';
import CampaignNavigationCards from '../../../composant/AQ/campagne/campagnehome';



const CampagneHomePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <CampaignNavigationCards/>
      </div>
    </div>
  );
};

export default CampagneHomePage;