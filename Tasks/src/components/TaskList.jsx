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
    <div className="min-h-screen bg-blue-900 text-white grid grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Task Grid */}
      <main className="p-8 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </main>
    </div>
  );
};

export default TaskList;