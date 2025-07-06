// App.jsx
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



import Sign from './components/Sign';
import Friends from './components/Friends';
import Home from './components/Home';
import ProjectHome from './components/project/ProjectHome';

import Chat from './components/Chat';

import TaskList from './components/TaskList';

function App() {
  return (
    <BrowserRouter>

        <Routes>
          <Route path="/sign" element={<Sign />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:username/friends" element={<Friends />} />
          <Route path="/project" element={<ProjectHome />} />



          <Route path="/:username/chat" element={<Chat />} />
          <Route path="/tasks" element={<TaskList />} />

        </Routes>

    </BrowserRouter>
  );
}

export default App;