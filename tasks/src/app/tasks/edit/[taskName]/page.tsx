"use client"
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import Sidebar from '../../../../../components/Sidebar';
import { useParams } from 'next/navigation';

import LoadingPage from '../../../../../components/LoadingPage';
import { useRouter } from 'next/navigation';

interface Task {
  taskName: string;
  taskPriority: string;
  startingDate: string;
  lastDate: string;
  collaborators: string[];
}

const TaskEditPage: React.FC = () => { 
  const router=useRouter()
    const [name,setName]=useState<string>("")
    const params=useParams()
   const [token,setToken]=useState<string>("")
    useEffect(()=>{
      const name = params.taskName
      setName(name as string)
      const storedToken=localStorage.getItem("authToken")
      setToken(storedToken as string)
    },[])




  const [taskName, setTaskName] = useState<string>('');
  const [startingDate, setStartingDate] = useState<string>('');
  const [endingDate, setEndingDate] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
    const[tasks,setTasks]=useState<Task[]>([])

  // useEffect(() => {
  //   if (tasks.length > 0) {
  //     const task = tasks.find((task) => task.taskName === name);
  //     if (task) {
  //       setTaskName(task.taskName);
  //       setPriority(task.taskPriority);
  //       setStartingDate(task.startingDate);
  //       setEndingDate(task.lastDate);
  //       setCollaborators(task.collaborators || []);
  //     }
  //   }
  // }, [tasks, name]);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      oldtaskName: name,
      newtaskName: taskName,
      startingDate:startingDate,
      lastDate: endingDate,
      taskPriority: priority,
      collaborators:collaborators,
    };
    console.log(data)
    try{
      const response=await fetch("http://localhost:8080/task/edit",{
        method:"PUT",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      if(!response.ok){
        const errData=await response.text()
        throw new Error(errData)
      }
      toast.success("Task updated successfully")

      router.push("/tasks")
    }
    catch(e){
      toast.error("Error "+e)
      console.log(e)
    }
    
  }

 

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0d0d1c] via-[#0f0f1c] to-[#050510] text-white font-[Poppins]">
      <div className="w-64 bg-[#111222] border-r border-cyan-700 shadow-lg z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-3xl bg-[#111222] rounded-2xl border border-cyan-700 shadow-[0_0_30px_#0ff3] p-10 relative z-10">
          <h1 className="text-4xl font-extrabold text-center text-cyan-400 tracking-widest mb-10 neon-glow">Edit Task</h1>

          <form className="space-y-8" onSubmit={handleClick}>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700"
                placeholder="Enter task name..."
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startingDate}
                  onChange={(e) => setStartingDate(e.target.value)}
                  className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={endingDate}
                  onChange={(e) => setEndingDate(e.target.value)}
                  className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Collaborators</label>
              <input
                type="text"
                value={collaborators.join(',')}
                onChange={(e) => setCollaborators(e.target.value.split(','))}
                placeholder="Search or type usernames..."
                className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Priority</label>
              <div className="flex gap-6">
                {['High', 'Medium', 'Low'].map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={(e) => setPriority(e.target.value)}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    <span className="text-gray-200">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wide"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="absolute top-0 left-0 w-full h-full border-2 border-cyan-500 rounded-2xl opacity-10 pointer-events-none animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditPage;