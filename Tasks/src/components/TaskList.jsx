import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/taskSlice/taskSlice";
import TaskCard from "./TaskCard";
import LoadingPage from "./LoadingPage";
import Sidebar from "./Sidebar";
import ErrorPage from "./ErrorPage";
import { div } from "three/tsl";
import BotpressWidget from "./BotpressWidget";
const TaskList = () => {
  const token = localStorage.getItem('authToken');

  if (!token) alert('Please login to continue.');

  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);
  const [err, setError] = useState("");
  

  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.task);


  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTasks()).unwrap();
      } catch (e) {
        console.log(e);
        setError(e);
      }
    };

    fetchData(); // Call the async function immediately
  }, [dispatch]);
  
  if (err) {

    let msg = "";
  
    if (typeof err === "string") {
      msg = err;
    } else if (err?.message) {
      msg = err.message;
    } else {
      msg = JSON.stringify(err); // fallback if it's a full object
    }
  
    return <ErrorPage message={msg} />;
  }

  if (status === "loading") return <LoadingPage />;
  if (status === "failed")
    return <p className="text-white text-center text-lg">Error: {error}</p>;
  if (status === "succeeded" && tasks.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d0f1a] via-[#0e111f] to-[#050610] text-white">
        <div className="absolute left-0">
          <Sidebar />
        </div>

        <h1 className="text-3xl font-bold mb-4">No Tasks Found</h1>
        <p className="text-gray-400">Start by creating a new task!</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#0d0f1a] text-white">
      {/* Sidebar */}
      <Sidebar />
      <BotpressWidget username={usernameJWT}></BotpressWidget>

      {/* Glowing Background & Task Grid */}
      <div className="flex-1 px-6 py-10 relative overflow-hidden">
        {/* 🌌 Background Glows like ProjectHome */}
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-20 left-20 animate-pulse z-0" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-20 right-20 animate-pulse z-0" />

        {/* Task Grid Container */}

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text text-center">
          Your Tasks
        </h1>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
