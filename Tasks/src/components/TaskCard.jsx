import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="relative bg-gray-950 text-white p-6 rounded-2xl shadow-xl transition-transform duration-200 hover:-translate-y-1 flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-cyan-400">{task.taskName}</h2>

      <p className="text-sm">
        <strong>Priority:</strong>{' '}
        <span className="bg-cyan-500 text-white text-xs px-2 py-[2px] rounded ml-1">
          {task.taskPriority}
        </span>
      </p>

      <p className="text-sm">
        <strong>Start:</strong> {new Date(task.startingDate).toLocaleDateString()}
      </p>

      <p className="text-sm">
        <strong>Deadline:</strong> {new Date(task.lastDate).toLocaleDateString()}
      </p>

      <div className="mt-2">
        <strong>Collaborators:</strong>
        <ul className="list-disc list-inside text-slate-300 text-sm mt-1">
          {task.collaborators &&
            task.collaborators.map((collab, index) => (
              <li key={index}>{collab}</li>
            ))}
        </ul>
      </div>
      <div className='text-white-100'>
        <button className='absolute bottom-[20px] bg-green-400 px-4 py-1 rounded '>Edit</button>
        <button className='absolute left-[30%] bottom-[20px] bg-red-400 px-4 py-1 rounded '>Delete</button>

      </div>
    </div>
  );
};

export default TaskCard;