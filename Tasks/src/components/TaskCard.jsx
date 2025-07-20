import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, deleteTask } from '../features/taskSlice/taskSlice';
import { toast } from "react-toastify";


const TaskCard = ({ task }) => {
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!token) {
      toast.error('Please login to continue!');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await dispatch(deleteTask(task.taskName)).unwrap();
      dispatch(fetchTasks()); 
      toast.success("Task Deleted Successfully");
    } catch (err) {
      toast.error("Server Error Right now");
      console.log(err);
    }
  };

  const start = new Date(task.startingDate);
  const end = new Date(task.lastDate);
  const diffInDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return (
    <div
      className="
        relative w-[20vw] min-w-[270px] max-w-[350px] h-[40vh] min-h-[370px]
        text-white p-6 rounded-2xl
        bg-gradient-to-tr from-gray-950 via-cyan-950 to-gray-900
        border-2 border-cyan-400/70 shadow-xl
        shadow-[0_0_40px_10px_rgba(8,145,178,0.25)]
        hover:shadow-[0_0_60px_16px_rgba(34,211,238,0.50)]
        transition-all duration-300 flex flex-col gap-4 group
      "
    >
      <h2
        className="
          text-2xl font-extrabold text-cyan-400
          drop-shadow-[0_0_16px_rgba(34,211,238,0.80)]
          tracking-wider uppercase mb-2
          text-shadow-cyan-500/80
        "
      >
        {task.taskName}
      </h2>

      <p className="text-sm">
        <strong>Priority:</strong>{' '}
        <span
          className="inline-block bg-cyan-400/80 text-white text-xs px-3 py-1 ml-1 rounded-full
            shadow-md shadow-cyan-300/80 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]
            animate-pulse group-hover:animate-none
            font-bold tracking-wide
          "
        >
          {task.taskPriority}
        </span>
      </p>

      <div className="text-sm flex gap-1 flex-col">
        <span>
          <strong>Start:</strong>{' '}
          <span className="text-cyan-200 font-medium">
            {start.toLocaleDateString()}
          </span>
        </span>
        <span>
          <strong>Deadline:</strong>{' '}
          <span className="text-pink-200 font-medium">
            {end.toLocaleDateString()}
          </span>
        </span>
      </div>

      <p className="text-sm">
        <strong>Duration:</strong>{' '}
        <span className="text-cyan-300 font-semibold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
          {diffInDays} day{diffInDays !== 1 ? 's' : ''}
        </span>
      </p>

      <div className="mt-2">
        <strong>Collaborators:</strong>
        {task.collaborators && task.collaborators.length > 0 ? (
          <ul className="list-disc list-inside text-slate-200 text-sm mt-1 space-y-1">
            {task.collaborators.map((collab, index) => (
              <li
                key={index}
                className="
                  relative pl-2 before:content-['👤'] before:absolute before:left-0 before:top-0.5
                  hover:text-cyan-400 transition-colors duration-150
                  "
              >
                {collab}
              </li>
            ))}
          </ul>
        ) : (
          <span className="block text-slate-400 italic mt-1">No collaborators</span>
        )}
      </div>

      <div className="mt-auto flex justify-between gap-3">
        <button
          onClick={() => navigate(`/task/edit/${encodeURIComponent(task.taskName)}`)}
          className="
            bg-gradient-to-r from-green-400 to-cyan-400/80
            text-white text-sm px-4 py-1 rounded-lg
            transition-all duration-200
            border border-green-100/20
            focus:outline-none focus:ring-2 focus:ring-green-300/70
            shadow-md shadow-green-500/30
            hover:shadow-green-400/80
            font-semibold tracking-wide
            hover:scale-105 hover:brightness-110
        "
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="
            bg-gradient-to-r from-red-500 via-pink-500 to-cyan-500
            text-white text-sm px-4 py-1 rounded-lg
            transition-all duration-200
            border border-red-100/20
            focus:outline-none focus:ring-2 focus:ring-red-300/70
            shadow-md shadow-pink-500/40
            hover:shadow-pink-300/70
            font-semibold tracking-wide
            hover:scale-105 hover:brightness-110
        "
        >
          Delete
        </button>
      </div>

      {/* Subtle glowing animated orb in background */}
      <div className="absolute -top-6 -right-10 w-36 h-36 bg-cyan-500 bg-opacity-25 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-pink-400 bg-opacity-20 rounded-full blur-2xl opacity-25 pointer-events-none animate-pulse"></div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TaskCard;
