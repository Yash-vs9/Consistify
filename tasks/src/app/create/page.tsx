"use client"
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

import { toast } from "react-toastify";




const ProjectHome: React.FC = () => {

  const [isDisabled,SetIsDisabled]=useState<boolean>(false)
  const [taskName, setTaskName] = useState<string>('');
  const [startingDate, setStartingDate] = useState<string>('');
  const [lastDate, setLastDate] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<string>('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFriends, setFilteredFriends] = useState<string[]>([]);
  const [friends,setFriends]=useState<string[]>([])
  const [token, setToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const router=useRouter()
  useEffect(() => {
    setHasMounted(true);
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);
  useEffect(()=>{
    if(token==null){
        return
    }
    try{
        const fetchFriend=(async()=>{
            const respone=await fetch("http://localhost:8080/users/friends",{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(!respone.ok){
                const errData=await respone.text()
                throw new Error (errData)
            }
            const data=await respone.json();
            setFriends(data)
    
        })
        fetchFriend()
    }
    catch(e){
        console.log(e)
    }
    
    
  },[token])

  const createTaskButton = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    SetIsDisabled(true)
    const data = { taskName, startingDate, lastDate, taskPriority, collaborators };
    try{
        const response=await fetch("http://localhost:8080/task/create",{
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify(data)
        })
        if(!response.ok){
            const errData=await response.json()
            const err=errData.error;
            throw new Error (err)
        }
        console.log(await response.json())
        toast.success("Task Created successfully")

        router.push("/tasks")
    }
    catch(e){
      toast.error(""+e)
        console.log(e)
        SetIsDisabled(false)
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = friends.filter((friend: string) =>
      friend.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const handleSelect = (friend: string) => {
    setSearchTerm('');
    setFilteredFriends([]);
    if (!collaborators.includes(friend)) {
      setCollaborators((prev) => [...prev, friend]);
    }
  };
  if(!hasMounted){
    return null
  }
  return (
    <div className="flex min-h-screen bg-[#0d0f1a] text-white">
      <Sidebar />

      <div className="flex-1 px-6 py-10 relative overflow-hidden flex flex-col items-center justify-start">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-20 left-20 animate-pulse z-0" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-20 right-20 animate-pulse z-0" />

        <h1 className="text-4xl font-bold mb-10 z-10 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text drop-shadow-xl">
          Create a New Task
        </h1>

        <div className="bg-[#181a28] h-[80vh] w-[85vw] flex border-2 border-cyan-400/30 rounded-xl overflow-hidden shadow-2xl z-10 relative">
          <div className="absolute top-0 left-0 w-full h-full rounded-xl border border-cyan-400 opacity-10 pointer-events-none animate-pulse" />

          {/* Left Section */}
          <div className="w-1/2 px-8 py-6 flex flex-col justify-evenly text-white gap-4 font-sans">
            <label>
              Task Name
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="mt-1 p-2 rounded bg-[#2b2d3a] text-white w-full"
              />
            </label>

            <label>
              Starting Date
              <input
                type="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                className="mt-1 p-2 rounded bg-[#2b2d3a] text-white w-full"
              />
            </label>

            <label>
              Last Date
              <input
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="mt-1 p-2 rounded bg-[#2b2d3a] text-white w-full"
              />
            </label>

            <label>Task Priority</label>
            <div className="flex gap-4 text-sm">
              {['High', 'Medium', 'Low'].map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="accent-cyan-500"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/2 px-8 py-6 text-white space-y-4">
            <h2 className="text-xl font-semibold">Add Collaborators</h2>

            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search from friend list"
              className="h-10 w-full bg-[#2b2d3a] text-white text-center font-mono border-2 border-white rounded outline-none"
            />

            {searchTerm && filteredFriends.length > 0 && (
              <ul className="bg-[#2a2c3a] border border-white rounded text-white shadow-lg max-h-40 overflow-y-auto">
                {filteredFriends.map((friend) => (
                  <li
                    key={friend}
                    onClick={() => handleSelect(friend)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#4b4e63] transition"
                  >
                    {friend}
                  </li>
                ))}
              </ul>
            )}

            {collaborators.length > 0 && (
              <div className="text-sm mt-2 max-h-28 overflow-y-auto">
                <p className="font-semibold">Selected Collaborators:</p>
                <ul className="list-disc list-inside text-cyan-400">
                  {collaborators.map((friend) => (
                    <li key={friend}>{friend}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              disabled={isDisabled}
              className="bg-cyan-600 text-white px-6 py-2 rounded border border-white hover:bg-cyan-500 transition w-full mt-4"
              onClick={createTaskButton}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHome;