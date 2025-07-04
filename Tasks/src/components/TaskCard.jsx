// TaskCard.jsx
import React from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{task.taskName}</h2>

      <p className={styles.label}>
        <strong>Priority:</strong> <span className={styles.priority}>{task.taskPriority}</span>
      </p>

      <p className={styles.label}>
        <strong>Start:</strong> {new Date(task.startingDate).toLocaleDateString()}
      </p>

      <p className={styles.label}>
        <strong>Deadline:</strong> {new Date(task.lastDate).toLocaleDateString()}
      </p>

      <div className={styles.collabSection}>
        <strong>Collaborators:</strong>
        <ul className={styles.collaborators}>
          {task.collaborators && task.collaborators.map((collab, index) => (
            <li key={index}>{collab}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskCard;