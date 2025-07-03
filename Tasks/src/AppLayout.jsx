
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserContextProvider from './context/UserContextProvider';

const AppLayout = () => {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
};

export default AppLayout;