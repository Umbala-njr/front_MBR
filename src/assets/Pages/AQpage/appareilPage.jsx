import React, { useEffect, useState } from 'react';
import AppareilManager from '../../composant/AQ/appareil';


const AppareilPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <AppareilManager/>
      </div>
    </div>
  );
};

export default AppareilPage;
