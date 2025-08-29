import React, { useEffect, useState } from 'react';
import ValeurEtapeTable from '../../../../composant/Mbr/Affichage/valeuretapeaffiche';



const ValeuretapeBrPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ValeurEtapeTable/>
      </div>
    </div>
  );
};

export default ValeuretapeBrPage;