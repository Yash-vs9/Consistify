"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [xp, setXp] = useState<number>(0);
  const [countFriends, setCountFriends] = useState<number>(0);
  const [countTasks, setCountTasks] = useState<number>(0);

  const rank = xp > 2000 ? "S" : xp > 1000 ? "A" : xp > 500 ? "B" : "C";

  // Rank thresholds
  const thresholds = { C: 0, B: 500, A: 1000, S: 2000 };

  let currentRankXp = 0;
  let nextRankXp = 0;

  if (rank === "C") {
    currentRankXp = thresholds.C;
    nextRankXp = thresholds.B;
  } else if (rank === "B") {
    currentRankXp = thresholds.B;
    nextRankXp = thresholds.A;
  } else if (rank === "A") {
    currentRankXp = thresholds.A;
    nextRankXp = thresholds.S;
  } else {
    currentRankXp = thresholds.S;
    nextRankXp = thresholds.S;
  }

  const progressPercent =
    rank === "S"
      ? 100
      : Math.min(((xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100, 100);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        setName(data[0][0]);
        setXp(data[0][1]);
        setCountFriends(data[0][2]);
        setCountTasks(data[0][3]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden p-4 bg-gray-950">
      {/* Animated Glowing Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-cyan-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-8 backdrop-blur-lg bg-opacity-90 transition-transform hover:scale-[1.01] hover:shadow-cyan-500/30">
        
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">{name || "User"}</h1>
          <p className="text-sm text-gray-400">Professional Profile Overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-blue-400/50 transition">
            <div className="text-2xl font-semibold text-blue-400">{countTasks}</div>
            <div className="text-gray-400 text-sm">Tasks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-pink-400/50 transition">
            <div className="text-2xl font-semibold text-pink-400">{countFriends}</div>
            <div className="text-gray-400 text-sm">Followers</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-green-400/50 transition">
            <div className="text-2xl font-semibold text-green-400">{xp}</div>
            <div className="text-gray-400 text-sm">XP</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-yellow-400/50 transition">
            <div className="text-2xl font-semibold text-yellow-400">{rank}</div>
            <div className="text-gray-400 text-sm">Rank</div>
          </div>
        </div>

        {/* Rank Progress */}
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Progress to Next Rank</h2>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full shadow-lg"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #06b6d4, #0ea5e9, #3b82f6)",
                boxShadow: "0 0 20px rgba(14,165,233,0.7)",
              }}
            ></div>
          </div>
          {rank !== "S" ? (
            <p className="text-xs text-gray-400 mt-1">
              {xp - currentRankXp} / {nextRankXp - currentRankXp} XP to Rank{" "}
              {rank === "C" ? "B" : rank === "B" ? "A" : "S"}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">Max Rank Achieved</p>
          )}
        </div>
      </div>
    </div>
  );
}
