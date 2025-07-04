// TaskList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/taskSlice/taskSlice';
import TaskCard from './TaskCard';
import styles from './TaskList.module.css';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.task);
  console.log('Tasks:', tasks);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <p className={styles.loading}>Loading tasks...</p>;
  if (error) return <p className={styles.loading}>Error: {error}</p>;
  if (tasks.length === 0) return <p className={styles.empty}>No tasks found.</p>;

  return (
    <div className={styles.container}>
      {tasks.map((task,index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
};

export default TaskList;