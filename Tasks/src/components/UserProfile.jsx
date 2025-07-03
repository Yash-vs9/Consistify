import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/UserContext';

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <>
          <p>Name: {userName}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

export default UserProfile;