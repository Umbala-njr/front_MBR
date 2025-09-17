import React, { useEffect, useState } from 'react';
import ProduitsCampagneEnCours from '../../../composant/AQ/campagne/campagneProduit';


const ProduitsCampagneEnCoursPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ProduitsCampagneEnCours/>
      </div>
    </div>
  );
};

export default ProduitsCampagneEnCoursPage;