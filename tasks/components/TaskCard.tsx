import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Task {
  taskName: string;
  taskPriority: string;
  startingDate: string;
  lastDate: string;
  collaborators: string[];
}

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const getUsernameFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };
  const usernameJWT = getUsernameFromToken(token);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/task/delete/${task.taskName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error);
      }
      setLoading(false);
      const data = await response.text();
      toast.success('Task Deleted Successfully');
      onTaskUpdate();
    } catch (e) {
      setLoading(false);
      toast.error('Error ' + e);
    }
  };

  const start = new Date(task.startingDate);
  const end = new Date(task.lastDate);
  const today = new Date();
  const diffInDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = end < new Date(today.setHours(0,0,0,0)); // Only dates, ignore time

  return (
    <div
      className="relative w-[22vw] min-w-[340px] max-w-[420px] h-[45vh] p-6 rounded-3xl
      shadow-xl bg-gradient-to-br from-[#141F2B]/90 via-[#192B43]/70 to-[#142634]/90
      border border-cyan-600/40 transition-all duration-300 ease-in-out shadow-cyan-500/20
      flex flex-col gap-4 select-none backdrop-blur-xl overflow-hidden"
      style={{ fontFamily: `"Orbitron", "Montserrat", "Arial", sans-serif"` }}
    >

      {/* Task Name & Expired badge */}
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-extrabold tracking-wide text-cyan-300 drop-shadow-lg">
          {task.taskName}
        </h2>
        {isExpired && (
          <span className="ml-2 px-3 py-1 rounded-xl bg-gradient-to-br from-pink-600 via-red-500 to-yellow-300 text-white text-xs font-bold tracking-wider animate-pulse shadow-md">
            Expired
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="uppercase text-xs font-semibold tracking-widest py-1 px-3 rounded-full
          bg-gradient-to-r from-cyan-500/60 to-blue-700/60 shadow-md border border-cyan-300
          animate-slide-up">{task.taskPriority}</span>
        <span className="ml-auto text-xs font-mono text-cyan-200 opacity-80 flex items-center">
          <svg className="w-4 h-4 mr-1 fill-cyan-400" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg>
          {diffInDays} day{diffInDays !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 my-2 opacity-90">
        <div>
          <span className="block text-[#a6c0d8] font-semibold text-sm">Start</span>
          <span className="block font-mono text-cyan-300/90">{start.toLocaleDateString()}</span>
        </div>
        <div>
          <span className="block text-[#ffc2e5] font-semibold text-sm">Deadline</span>
          <span className="block font-mono text-pink-400/90">{end.toLocaleDateString()}</span>
        </div>
      </div>

      <div>
        <span className="text-cyan-200 font-semibold opacity-90">Collaborators</span>
        <ul className="mt-1 space-y-1 text-sm text-cyan-100 font-mono opacity-90">
          {task.collaborators?.map((collab, idx) => (
            <li key={idx}
              className="pl-2 before:content-['→'] before:text-pink-400 before:mr-1 animate-fade-in">{collab}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center gap-3 mt-auto">
        <button
          onClick={() => router.push(`/tasks/edit/${encodeURIComponent(task.taskName)}`)}
          className="flex-1 py-2 px-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-700 to-purple-700
             text-white font-bold uppercase tracking-wider text-sm
            transition-all duration-150 hover:brightness-110 hover:scale-105 border-none animate-slide-up"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-2 px-0 rounded-xl bg-gradient-to-r from-pink-600 via-red-600 to-red-500 text-white font-bold uppercase tracking-wider text-sm
            transition-all duration-150 hover:brightness-110 hover:scale-105 border-none animate-slide-up"
        >
          {loading ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
