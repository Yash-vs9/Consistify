import './App.css'
import Sign from './components/Sign'
import Friends from './components/Friends';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectHome from './components/project/ProjectHome';
import FriendsList from './components/FriendsList';
import UserProfile from './components/UserProfile';
import Chat from './components/Chat';
const router=createBrowserRouter([
  {
    element:<Sign/>,
    path:'/sign'
  },
  {
    element:<Home/>,
    path:'/home'
  },
  // {
  //   element:<Protected/>,
  //   path:'/profile'
  // },
  {
    element:<Friends/>,
    path:'/:username/friends'
  },
  {
    element:<ProjectHome/>,
    path:'/project'
  },
  {
    element:<UserProfile/>,
    path:'/profile'
  },
  {
    element:<FriendsList/>,
    path:'/:username/list'
  },
  {
    element:<Chat/>,
    path:'/:username/chat'
  }
  
])
function App() {


  return (
    <>
       <RouterProvider router={router}/>
    </>
  )
}

export default App
