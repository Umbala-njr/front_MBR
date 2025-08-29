import React, { useEffect, useState } from 'react';
import MatiereactionManager from '../../../../composant/Mbr/Action/matiereAction';


const MatiereactionPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <MatiereactionManager/>
      </div>
    </div>
  );
};

export default MatiereactionPage;