"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Task {
  taskName: string;
  taskPriority: string;
  startingDate: string;
  lastDate: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [checkedDays, setCheckedDays] = useState<Set<string>>(new Set());

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

  // Generate array of dates between start and end date
  const generateDateRange = () => {
    const dates = [];
    const start = new Date(task.startingDate);
    const end = new Date(task.lastDate);
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateRange = generateDateRange();

  // Load checked days from localStorage on component mount
  useEffect(() => {
    const savedChecks = localStorage.getItem(`task_checks_${task.taskName}`);
    if (savedChecks) {
      setCheckedDays(new Set(JSON.parse(savedChecks)));
    }
  }, [task.taskName]);

  // Save checked days to localStorage whenever it changes
  const saveCheckedDays = (newCheckedDays: Set<string>) => {
    setCheckedDays(newCheckedDays);
    localStorage.setItem(`task_checks_${task.taskName}`, JSON.stringify([...newCheckedDays]));
  };

  const handleDayToggle = (dateString: string) => {
    const newCheckedDays = new Set(checkedDays);
    if (newCheckedDays.has(dateString)) {
      newCheckedDays.delete(dateString);
    } else {
      newCheckedDays.add(dateString);
    }
    saveCheckedDays(newCheckedDays);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent expansion if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
      // Clean up localStorage for this task
      localStorage.removeItem(`task_checks_${task.taskName}`);
      onTaskUpdate();
    } catch (e) {
      setLoading(false);
      toast.error('Error ' + e);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/tasks/edit/${task.taskName.replace(/\s+/g, '-')}`);
  };

  const start = new Date(task.startingDate);
  const end = new Date(task.lastDate);
  const today = new Date();
  const diffInDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = end < new Date(today.setHours(0,0,0,0));

  // Calculate progress
  const completedDays = checkedDays.size;
  const totalDays = dateRange.length;
  const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  return (
    <div
      className={`relative w-[22vw] min-w-[340px] max-w-[420px] p-6 rounded-3xl
      shadow-xl bg-gradient-to-br from-[#141F2B]/90 via-[#192B43]/70 to-[#142634]/90
      border border-cyan-600/40 transition-all duration-500 ease-in-out shadow-cyan-500/20
      flex flex-col gap-4 select-none backdrop-blur-xl overflow-hidden cursor-pointer
      hover:scale-[1.02] hover:shadow-cyan-400/30 ${
        isExpanded ? 'h-auto max-h-[80vh] overflow-y-auto' : 'h-[45vh]'
      }`}
      style={{ fontFamily: `"Orbitron", "Montserrat", "Arial", sans-serif"` }}
      onClick={handleCardClick}
    >

      {/* Task Name & Expired badge */}
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-extrabold tracking-wide text-cyan-300 drop-shadow-lg">
          {task.taskName}
        </h2>
        {isExpanded && (
          <span className="ml-auto text-cyan-400 text-lg">✕</span>
        )}
        {isExpired && (
          <span className="ml-2 px-3 py-1 rounded-xl bg-gradient-to-br from-pink-600 via-red-500 to-yellow-300 text-white text-xs font-bold tracking-wider animate-pulse shadow-md">
            Expired
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700/50 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-cyan-200 text-center">
        {completedDays}/{totalDays} days completed ({Math.round(progressPercentage)}%)
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
        <span className="text-cyan-200 font-semibold opacity-90">Description</span>
        <ul className="mt-1 space-y-1 text-sm text-cyan-100 font-mono opacity-90">
          {task.description}
        </ul>
      </div>

      {/* Daily Checkboxes - Only show when expanded */}
      {isExpanded && (
        <div className="mt-4 border-t border-cyan-600/30 pt-4">
          <h3 className="text-cyan-300 font-bold mb-3">Daily Progress</h3>
          <div className="grid grid-cols-7 gap-2 max-h-64 overflow-y-auto">
            {dateRange.map((date) => {
              const dateString = date.toISOString().split('T')[0];
              const isToday = date.toDateString() === new Date().toDateString();
              const isPast = date < new Date(new Date().setHours(0,0,0,0));
              const isChecked = checkedDays.has(dateString);
              
              return (
                <div
                  key={dateString}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200
                    ${isToday ? 'border-yellow-400 bg-yellow-400/20' : 'border-cyan-600/40'}
                    ${isChecked ? 'bg-green-500/30 border-green-400' : 'hover:bg-cyan-500/20'}
                    ${isPast && !isChecked ? 'opacity-50' : ''}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDayToggle(dateString);
                  }}
                >
                  <div className="text-xs text-cyan-200 mb-1">
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-cyan-400 mb-2">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by parent div click
                    className="w-4 h-4 text-green-500 bg-transparent border-2 border-cyan-400 rounded focus:ring-cyan-500 focus:ring-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons - Only show when not expanded */}
      {!isExpanded && (
        <div className="flex justify-between items-center gap-3 mt-auto">
          <button
            onClick={handleEditClick}
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
      )}

      {/* Click hint */}
      {!isExpanded && (
        <div className="absolute top-2 right-2 text-cyan-400/60 text-xs">
          Click to track daily progress
        </div>
      )}
    </div>
  );
};

export default TaskCard;