import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTask } from '../features/taskSlice/taskSlice';
import { toast } from "react-toastify";
import Sidebar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTasks } from '../features/taskSlice/taskSlice';
import { log } from 'three/tsl';
import LoadingPage from './LoadingPage';
const TaskEditPage = () => {
  const { param } = useParams();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const { tasks, status, error } = useSelector((state) => state.task);

    
    
    
    const [taskName, setTaskName] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [priority, setPriority] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  // Fetch tasks once
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Set form values when tasks are loaded
  useEffect(() => {
    if (status === "succeeded" && tasks.length > 0) {
      const task = tasks.find((task) => task.taskName === param);
      if (task) {
        setTaskName(task.taskName);
        console.log(task)
        setPriority(task.taskPriority);
        // set collaborators if available
      }
    }
  }, [tasks, status, param]);


  
  
  const handleClick = async (e) => {
    e.preventDefault();
    const data = {
      oldtaskName: param,
      newtaskName: taskName,
      startingDate: startingDate,
      lastDate: endingDate,
      taskPriority: priority,
      collaborators: collaborators
    };

    try {

      const result = await dispatch(editTask(data)).unwrap();
      toast.success("Task updated Successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to Update Task -> " + error);
      console.error("Failed to update task:", error);
    }
  };
  if(status==="loading"){
    return <LoadingPage />;

  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0d0d1c] via-[#0f0f1c] to-[#050510] text-white font-[Poppins]">
      
      {/* Sidebar on Left */}
      <div className="w-64 bg-[#111222] border-r border-cyan-700 shadow-lg z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-3xl bg-[#111222] rounded-2xl border border-cyan-700 shadow-[0_0_30px_#0ff3] p-10 relative z-10">
          <h1 className="text-4xl font-extrabold text-center text-cyan-400 tracking-widest mb-10 neon-glow">
            edit
          </h1>

          <form className="space-y-8">
            {/* Task Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Task Name</label>
              <input
                type="text"
                placeholder="Enter task name..."
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-[#1b1c2e] text-white placeholder-gray-500 p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200"
              />
            </div>

            {/* Dates */}
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startingDate}
                  onChange={(e) => setStartingDate(e.target.value)}
                  className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={endingDate}
                  onChange={(e) => setEndingDate(e.target.value)}
                  className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Collaborators</label>
              <input
                type="text"
                placeholder="Search or type usernames..."
                value={collaborators}
                onChange={(e) => setCollaborators(e.target.value.split(','))}
                className="w-full bg-[#1b1c2e] text-white placeholder-gray-500 p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Priority</label>
              <div className="flex gap-6">
                {['High', 'Medium', 'Low'].map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={(e) => setPriority(e.target.value)}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    <span className="text-gray-200">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleClick}
                className="w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wide shadow-[0_0_5px_#0ff] hover:shadow-[0_0_10px_#0ff] transition"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Glowing Edge */}
          <div className="absolute top-0 left-0 w-full h-full border-2 border-cyan-500 rounded-2xl opacity-10 pointer-events-none animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditPage;