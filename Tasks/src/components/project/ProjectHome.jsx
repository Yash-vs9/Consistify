import React from 'react'
import styles from './ProjectHome.module.css';

const ProjectHome = () => {
  return (
    <div className={styles.window}>
      <h1 className={styles.heading}>PROJECT</h1>
      <div className={styles.box}>
        <div className={styles.left}>
          <div>Group <input type="text" className={styles.leftInput} /></div>
          <div>Name <input type="text" className={styles.leftInput} /></div>
          <div>Description <input type="text" className={styles.leftInput} /></div>
          <div>Time Limit <input type="text" className={styles.leftInput} /></div>
        </div>
        <div className={styles.right}>
          <h1>Add Collaborators</h1>
          <input type="text" placeholder="Search From Friend List" className={styles.rightInput} />
          <button className={styles.rightButton}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default ProjectHome;