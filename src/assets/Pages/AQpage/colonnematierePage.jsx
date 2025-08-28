import React, { useEffect, useState } from 'react';
import TableauColonnes from '../../composant/AQ/matiere/colonnematière';


const ColonneMATPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <TableauColonnes/>
      </div>
    </div>
  );
};

export default ColonneMATPage;