import React, { useEffect, useState } from 'react';
import ListeDocument from '../../../../composant/Mbr/Action/liste_doc';




const ListedocumentPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ListeDocument/>
      </div>
    </div>
  );
};

export default ListedocumentPage;