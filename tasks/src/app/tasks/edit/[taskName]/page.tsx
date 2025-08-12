"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../../../../components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import LoadingPage from "../../../../../components/LoadingPage";

interface Task {
  taskName: string;
  taskPriority: string;
  startingDate: string;
  lastDate: string;
  description: string;
}

const TaskEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [taskName, setTaskName] = useState<string>("");
  const [startingDate, setStartingDate] = useState<string>("");
  const [endingDate, setEndingDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const rawName = params.taskName;
    if (rawName) {
      // Decode both %20 and -
      const decoded = decodeURIComponent(rawName as string).replace(/-/g, " ");
      setName(decoded);
    }
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, [params.taskName]);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      oldtaskName: name,
      newtaskName: taskName,
      startingDate: startingDate,
      lastDate: endingDate,
      taskPriority: priority,
      description: description,
    };

    try {
      const response = await fetch("http://localhost:8080/task/edit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData);
      }

      toast.success("Task updated successfully");

      // Redirect back to /tasks after saving
      router.push("/tasks");
    } catch (err) {
      toast.error("Error " + err);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0d0d1c] via-[#0f0f1c] to-[#050510] text-white font-[Poppins]">
      <div className="w-64 bg-[#111222] border-r border-cyan-700 shadow-lg z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-3xl bg-[#111222] rounded-2xl border border-cyan-700 shadow-[0_0_30px_#0ff3] p-10 relative z-10">
          <h1 className="text-4xl font-extrabold text-center text-cyan-400 tracking-widest mb-10 neon-glow">
            Edit Task
          </h1>

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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Search or type usernames..."
                className="w-full bg-[#1b1c2e] text-white p-3 rounded-md border border-cyan-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Priority</label>
              <div className="flex gap-6">
                {["High", "Medium", "Low"].map((level) => (
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