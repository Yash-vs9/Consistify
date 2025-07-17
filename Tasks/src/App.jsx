// App.jsx
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from './components/Profile';

import Sign from './components/Sign';
import Friends from './components/Friends';
import Home from './components/Home';
import ProjectHome from './components/project/ProjectHome';
import NotFound from './components/NotFound';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import SidebarLayout from './components/pages/SidebarLayout';
import TaskEditPage from './components/TaskEditPage';
import Test from './components/Test';
import Bot from './components/Bot';
function App() {
  return (
    <BrowserRouter>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-[#0f172a] text-cyan-300 shadow-lg rounded-lg px-4 py-3 border border-cyan-400"
        bodyClassName="text-sm"
        progressClassName="bg-cyan-500"
      />
        <Routes>
          <Route path="/sign" element={<Sign />} />
          <Route path="/" element={<Home />} />
          <Route path="/:username/friends" element={<Friends />} />
          <Route path="/project" element={<ProjectHome />} />
          <Route path="/dashboard" element={<SidebarLayout />} />
          <Route path="/1" element={<Test />} />
          <Route path="/bot" element={<Bot />} />

          <Route path="/task/edit/:param" element={<TaskEditPage/>} />
          <Route path="/profile" element={<Profile/>} />



          <Route path="/:username/chat" element={<Chat />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/*" element={<NotFound />} />
         


        </Routes>

    </BrowserRouter>
    
  );
}

export default App;