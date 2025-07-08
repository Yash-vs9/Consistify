import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/taskSlice/taskSlice';
import TaskCard from './TaskCard';
import LoadingPage from './LoadingPage';
import Sidebar from './Sidebar';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <p className="text-white text-center text-lg">Loading tasks...</p>;
  if (error) return <p className="text-white text-center text-lg">Error: {error}</p>;
  if (tasks.length === 0) return <LoadingPage />;

  return (
    <div className="flex min-h-screen bg-[#0d0f1a] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Glowing Background & Task Grid */}
      <div className="flex-1 px-6 py-10 relative overflow-hidden">
        {/* 🌌 Background Glows like ProjectHome */}
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-20 left-20 animate-pulse z-0" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-20 right-20 animate-pulse z-0" />

        {/* Task Grid Container */}

          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text text-center">
            Your Tasks
          </h1>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {tasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>

      </div>
    </div>
  );
};

export default TaskList;