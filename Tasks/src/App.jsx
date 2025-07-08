// App.jsx
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



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
function App() {
  return (
    <BrowserRouter>

        <Routes>
          <Route path="/sign" element={<Sign />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:username/friends" element={<Friends />} />
          <Route path="/project" element={<ProjectHome />} />
          <Route path="/dashboard" element={<SidebarLayout />} />
          <Route path="/1" element={<Test />} />

          <Route path="/task/edit/:param" element={<TaskEditPage/>} />



          <Route path="/:username/chat" element={<Chat />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/*" element={<NotFound />} />


        </Routes>

    </BrowserRouter>
  );
}

export default App;