'use client';

import React, { useState } from 'react';
import { USERS } from '../../data/users';

const UserProfile: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div
      id="userProfileContainer"
      className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-md max-w-sm mx-auto border"
    >
      {loggedIn ? (
        <div id="loggedInSection" className="flex flex-col items-center">
          <p id="loggedInMessage" className="text-lg font-bold mb-4">
            User {USERS.regular.login} authenticated
          </p>
          <button
            id="logoutButton"
            onClick={handleLogout}
            className="w-full bg-red-600 text-gray-100 py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      ) : (
        <p id="loggedOutMessage" className="text-center">
          You have been logged out. Please log in.
        </p>
      )}
    </div>
  );
};

export default UserProfile;
