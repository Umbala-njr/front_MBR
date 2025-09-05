import React, { useEffect, useState } from 'react';
import ListeDocumentCamp from '../../../composant/AQ/campagne/liste_document';



const DocumentCampPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <ListeDocumentCamp/>
      </div>
    </div>
  );
};

export default DocumentCampPage;