// App.jsx
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import AppLayout from './AppLayout';

import Sign from './components/Sign';
import Friends from './components/Friends';
import Home from './components/Home';
import ProjectHome from './components/project/ProjectHome';
import FriendsList from './components/FriendsList';
import UserProfile from './components/UserProfile';
import Chat from './components/Chat';
import Test from './components/Test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // ✅ Context provided to all routes
    children: [
      { path: 'sign', element: <Sign /> },
      { path: 'home', element: <Home /> },
      { path: ':username/friends', element: <Friends /> },
      { path: 'project', element: <ProjectHome /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'test', element: <Test /> },
      { path: ':username/list', element: <FriendsList /> },
      { path: ':username/chat', element: <Chat /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;