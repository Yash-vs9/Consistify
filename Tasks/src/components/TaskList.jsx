import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/taskSlice/taskSlice';
import TaskCard from './TaskCard';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <p className="text-white text-center text-lg">Loading tasks...</p>;
  if (error) return <p className="text-white text-center text-lg">Error: {error}</p>;
  if (tasks.length === 0) return <p className="text-gray-400 text-center text-base">No tasks found.</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-8 bg-blue-900 min-h-screen">
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
};

export default TaskList;