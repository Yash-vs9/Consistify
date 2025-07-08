import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const start = new Date(task.startingDate);
  const end = new Date(task.lastDate);
  const diffInDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative bg-gray-950 w-[20vw] h-[40vh] text-white p-6 rounded-2xl shadow-xl transition-transform duration-200 hover:-translate-y-1 flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-cyan-400">{task.taskName}</h2>

      <p className="text-sm">
        <strong>Priority:</strong>{' '}
        <span className="bg-cyan-500 text-white text-xs px-2 py-[2px] rounded ml-1">
          {task.taskPriority}
        </span>
      </p>

      <p className="text-sm">
        <strong>Start:</strong> {start.toLocaleDateString()}
      </p>

      <p className="text-sm">
        <strong>Deadline:</strong> {end.toLocaleDateString()}
      </p>

      <p className="text-sm">
        <strong>Duration:</strong>{' '}
        <span className="text-cyan-300">{diffInDays} day{diffInDays !== 1 ? 's' : ''}</span>
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

      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={() => navigate(`/task/edit/${encodeURIComponent(task.taskName)}`)}
          className="bg-green-500 hover:bg-green-600 text-sm px-4 py-1 rounded-lg transition-colors duration-150"
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-sm px-4 py-1 rounded-lg transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;