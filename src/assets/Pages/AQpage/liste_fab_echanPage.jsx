import React, { useEffect, useState } from 'react';
import FabricationEchanList from '../../composant/AQ/liste_fab_echan';




const Fab_echanPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <FabricationEchanList/>
      </div>
    </div>
  );
};

export default Fab_echanPage;