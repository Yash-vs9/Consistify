import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editTask } from '../features/taskSlice/taskSlice';
import { toast } from "react-toastify";

import { useNavigate, useParams } from 'react-router-dom';
const TaskEditPage = () => {
    const {param}=useParams()
    const [taskName,setTaskName]=useState("")
    const [startingDate,setStartingDate]=useState("")
    const [endingDate,setEndingDate]=useState("")
    const [priority,setPriority]=useState("")
    const [collaborators,setCollaborators]=useState([])
    const dispatch=useDispatch()


    const navigate=useNavigate()

    const handleClick=  ( async(e)=>{
        e.preventDefault(); 
        const data={
            oldtaskName:param,
            newtaskName:taskName,
            startingDate:startingDate,
            lastDate:endingDate,
            taskPriority:priority,
            collaborators:collaborators
        }
        console.log(data)
        
        try {
          if (!taskName || !startingDate || !endingDate || !priority) {
            throw new Error("Missing required task fields");
          }
            const result = await dispatch(editTask(data)).unwrap(); 
            console.log("Success:", result);
            toast.success("Task updated Successfully")
            navigate("/tasks")

          } catch (error) {
            toast.error("Failed to Update Task -> "+error)
            console.error("Failed to update task:", error);

          }

    })
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d1c] via-[#0f0f1c] to-[#050510] text-white flex items-center justify-center px-6 py-12 font-[Poppins]">
      <div className="w-full max-w-3xl bg-[#111222] rounded-2xl border border-cyan-700 shadow-[0_0_30px_#0ff3] p-10 relative">
        <h1 className="text-4xl font-extrabold text-center text-cyan-400 tracking-widest mb-10 neon-glow">
          EDIT TASK
        </h1>

        <form className="space-y-8">
          {/* Task Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Task Name</label>
            <input
              type="text"
              placeholder="Enter task name..."
              value={taskName}
              onChange={(e)=>setTaskName(e.target.value)}
              className="w-full bg-[#1b1c2e] text-white placeholder-gray-500 p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200"
            />
          </div>

          {/* Dates */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startingDate}
              onChange={(e)=>setStartingDate(e.target.value)}
                className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Deadline</label>
              <input
                type="date"
                value={endingDate}
              onChange={(e)=>setEndingDate(e.target.value)}
                className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          {/* Collaborators */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Collaborators</label>
            <input
              type="text"
              placeholder="Search or type usernames..."
              value={collaborators}
              onChange={(e)=>setCollaborators(e.target.value.split(','))}
              className="w-full bg-[#1b1c2e] text-white placeholder-gray-500 p-3 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Priority</label>
            <div className="flex gap-6">
              {['High', 'Medium', 'Low'].map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={priority===level}
                    onChange={(e)=>setPriority(e.target.value)}
                    className="accent-cyan-500 w-4 h-4"
                  />
                  <span className="text-gray-200">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              onClick={(e)=>handleClick(e)}
              className="w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wide shadow-[0_0_5px_#0ff] hover:shadow-[0_0_10px_#0ff] transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Glowing Edge */}
        <div className="absolute top-0 left-0 w-full h-full border-2 border-cyan-500 rounded-2xl opacity-10 pointer-events-none animate-pulse"></div>
      </div>
    </div>
  );
};

export default TaskEditPage;