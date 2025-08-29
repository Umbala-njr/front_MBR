import React, { useEffect, useState } from 'react';
import TableauValeursMatiere from '../../../../composant/Mbr/Affichage/tableaumatiere';



const TableaumatierePage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <TableauValeursMatiere/>
      </div>
    </div>
  );
};

export default TableaumatierePage;