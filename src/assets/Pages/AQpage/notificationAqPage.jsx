import React, { useEffect, useState } from 'react';
import Notifications from '../../composant/AQ/notificationsAQ';


const NotificationPage = () => {

  return (
    <div className="flex flex-col w-full h-full">
      

      <div>
        <Notifications/>
      </div>
    </div>
  );
};

export default NotificationPage;