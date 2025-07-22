
import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react';

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

const TaskCard: React.FC<TaskCardProps> = ({ task ,onTaskUpdate}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const router=useRouter()
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
    try{
      const response=await fetch(`http://localhost:8080/task/delete/${task.taskName}`,{
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(!response.ok){
        const errData=await response.json()
      }
      const data=await response.text()
      console.log(data)
      toast.success("Task Deleted Successfully")
      onTaskUpdate()
    }
    catch(e){
      toast.error("Error "+e)
      console.log(e)
    }
    
    
  };

  const start = new Date(task.startingDate);
  const end = new Date(task.lastDate);
  const diffInDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative w-[20vw] h-[42vh] p-6 rounded-2xl shadow-2xl 
      backdrop-blur-xl border border-cyan-500/10 
      bg-gradient-to-br from-gray-900/70 via-gray-950/70 to-gray-900/70 
      transition-transform duration-200 hover:-translate-y-1 hover:shadow-cyan-600/40 flex flex-col gap-3 text-white">
      
      <h2 className="text-xl font-semibold text-cyan-400">{task.taskName}</h2>

      <p className="text-sm">
        <strong>Priority:</strong>{' '}
        <span className="bg-cyan-500/80 text-white text-xs px-2 py-[2px] rounded ml-1">
          {task.taskPriority}
        </span>
      </p>

      <p className="text-sm"><strong>Start:</strong> {start.toLocaleDateString()}</p>
      <p className="text-sm"><strong>Deadline:</strong> {end.toLocaleDateString()}</p>

      <p className="text-sm">
        <strong>Duration:</strong>{' '}
        <span className="text-cyan-300">{diffInDays} day{diffInDays !== 1 ? 's' : ''}</span>
      </p>

      <div className="mt-1">
        <strong>Collaborators:</strong>
        <ul className="list-disc list-inside text-slate-300 text-sm mt-1">
          {task.collaborators?.map((collab, index) => (
            <li key={index}>{collab}</li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex justify-between gap-3">
        <button
          onClick={() => router.push(`/tasks/edit/${encodeURIComponent(task.taskName)}`)}
          className="bg-green-500 hover:bg-green-600 text-sm px-4 py-1 rounded-lg transition-colors duration-150"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-sm px-4 py-1 rounded-lg transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;