import React from 'react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const user = {
    name: 'Yash',
    xp: 2400,
    friends: 12,
    tasks: [
      { id: 1, title: 'Build Landing Page', status: 'In Progress' },
      { id: 2, title: 'Fix Auth Bug', status: 'In Progress' },
      { id: 3, title: 'Write Unit Tests', status: 'Pending' }
    ]
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.xp}>XP: {user.xp}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <h2>{user.friends}</h2>
            <p>Friends</p>
          </div>
          <div className={styles.statBox}>
            <h2>{user.tasks.length}</h2>
            <p>Tasks Ongoing</p>
          </div>
        </div>
        <div className={styles.taskSection}>
          <h3>Ongoing Tasks</h3>
          <ul>
            {user.tasks.map(task => (
              <li key={task.id} className={styles.taskItem}>
                <span>{task.title}</span>
                <span className={styles.status}>{task.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;