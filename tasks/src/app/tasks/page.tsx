"use client";

import React, { useEffect, useState } from "react";
import TaskCard from "../../../components/TaskCard";
import LoadingPage from "../../../components/LoadingPage";
import Sidebar from "../../../components/Sidebar";
import ErrorPage from "../../../components/ErrorPage";
import BotpressWidget from "components/BotpressWidget";



interface Task {
  taskName: string;
  taskPriority: string;
  startingDate: string;
  lastDate: string;
  collaborators: string[];
}

const TaskList: React.FC = () => {

  const [token, setToken] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading]=useState<boolean>(false)
  // 🔐 Extract username from token
  const getUsernameFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);

  // pages/api/ask.js







  // ✅ Read localStorage in `useEffect` safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        alert("Please login to continue.");
        return;
      }
      setToken(storedToken);
    }
  }, []);

  // 🔁 Fetch tasks once token is available
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      setStatus("loading");

      try {
        const response = await fetch("http://localhost:8080/task/getModel", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.text();
          throw new Error(errData);
        }

        const data: Task[] = await response.json();
        setTasks(data);
        setStatus("succeeded");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setStatus("failed");
      }
    };

    if (token) fetchTasks();
  }, [token]);

  // 📣 Task refresh method to be passed to TaskCard
  const handleTaskChange = () => {

    if (token) {
      fetch("http://localhost:8080/task/getModel", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) return res.text().then((err) => Promise.reject(err));
          setLoading(false)
          return res.json();
        })
        .then((data: Task[]) => setTasks(data))
        .then(()=>{

        })
        .catch((err) => {
          setError(err.message || "Failed to update task list.");
        });
    }
  };

  if (error) return <ErrorPage message={error} />;
  if (status === "loading") return <LoadingPage />;
  if (status === "succeeded" && tasks.length === 0)
    if(loading) return <LoadingPage/>
   
  if(tasks==null){
    return <LoadingPage/>
  }
  return (
    <div className="flex min-h-screen bg-[#0d0f1a] text-white">
      <Sidebar />
      <div className="flex-1 px-6 py-10 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-20 left-20 animate-pulse z-0" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-20 right-20 animate-pulse z-0" />
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text text-center">
          Your Tasks
        </h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.taskName} task={task} onTaskUpdate={handleTaskChange} />
          ))}
        </div>
        <BotpressWidget username={usernameJWT as string}/>
        
      </div>
    </div>
  );
};

export default TaskList;