"use client";
import { useEffect, useState } from "react";
import LoadingPage from "components/LoadingPage";
import { toast } from "react-toastify";

export default function Profile() {
  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [xp, setXp] = useState<number>(0);
  const [countFriends, setCountFriends] = useState<number>(0);
  const [countTasks, setCountTasks] = useState<number>(0);

  // Rank & thresholds
  const rank = xp > 2000 ? "S" : xp > 1000 ? "A" : xp > 500 ? "B" : "C";
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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const progressPercent =
    rank === "S"
      ? 100
      : Math.min(
          ((xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100,
          100
        );

  // Token & fetch
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok){
          const errData=await response.text()
          toast.error(errData)
          throw  Error(errData)
        }
        const data = await response.json();
        console.log(data);

        setName(data[0][0]);
        setXp(data[0][1]);
        setCountFriends(data[0][3]);
        setCountTasks(data[0][2]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);
  if(name===""){
    return <LoadingPage/>
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-cyan-500 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-900/80 rounded-2xl border border-gray-700 p-8 shadow-xl backdrop-blur-lg">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-4xl font-bold shadow-lg">
            {name ? name.charAt(0) : "U"}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {name || "User"}
            </h1>
            <p className="text-gray-400 text-sm tracking-wide">
              Dedicated to productivity & growth — track your tasks, connect
              with peers, and climb the ranks.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value={countTasks} label="Completed Tasks" color="blue" />
          <StatCard value={countFriends} label="Followers" color="pink" />
          <StatCard value={xp} label="XP Earned" color="green" />
          <StatCard value={rank} label="Current Rank" color="yellow" />
        </section>

        {/* Rank Progress */}
        <section className="bg-gray-900/80 rounded-2xl border border-gray-700 p-8 shadow-xl backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-3">Progress to Next Rank</h2>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden mb-2">
            <div
              style={{
                width: `${progressPercent}%`,
                background:
                  "linear-gradient(90deg, #06b6d4, #0ea5e9, #3b82f6)",
                boxShadow: "0 0 15px rgba(14,165,233,0.6)",
              }}
              className="h-4 rounded-full transition-all duration-500"
            />
          </div>
          {rank !== "S" ? (
            <p className="text-xs text-gray-400">
              {xp - currentRankXp} / {nextRankXp - currentRankXp} XP until Rank{" "}
              {rank === "C" ? "B" : rank === "B" ? "A" : "S"}
            </p>
          ) : (
            <p className="text-xs text-gray-400">Max Rank Achieved</p>
          )}
        </section>

        {/* About Text */}
        <section className="bg-gray-900/80 rounded-2xl border border-gray-700 p-8 shadow-xl backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            This is your personal performance hub. Here you can monitor your
            growth, achievements, and social reach. Your XP reflects dedication,
            while your Rank showcases your consistency. Keep engaging, complete
            more tasks, and connect with peers to level up and unlock new
            opportunities.
          </p>
        </section>
      </div>
    </div>
  );
}


const colorClasses: Record<
  string,
  { text: string; hover: string }
> = {
  blue: { text: "text-blue-400", hover: "hover:border-blue-400" },
  pink: { text: "text-pink-400", hover: "hover:border-pink-400" },
  green: { text: "text-green-400", hover: "hover:border-green-400" },
  yellow: { text: "text-yellow-400", hover: "hover:border-yellow-400" },
};

const StatCard = ({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color: string;
}) => (
  <div
    className={`rounded-xl p-6 bg-gray-800 border border-transparent transition-all shadow-lg flex flex-col items-center justify-center ${
      colorClasses[color]?.hover || ""
    }`}
  >
    <span className={`text-3xl font-bold ${colorClasses[color]?.text || ""}`}>
      {value}
    </span>
    <span className="text-gray-400 text-sm mt-1">{label}</span>
  </div>
);
