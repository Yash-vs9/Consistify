"use client";
import React, { use, useEffect, useState } from "react";
import SplashCursor from "../../../SplashCursor/SplashCursor";
import Sidebar from "../../../components/Sidebar";
import { Activity, Users, Folder, TrendingUp } from "lucide-react"; // Icons
import LoadingPage from "components/LoadingPage";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
}

const MainDashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [token, setToken] = useState<string>("");
  const [queryCount,setQueryCount]=useState<number>(0)
  const [taskCount,setTaskCount]=useState<number>(0)
  const [userCount,setUserCount]=useState<number>(0)
  const [isLoading,setIsLoading]=useState<boolean>(true)
  const API_BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL;
  const router=useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if(storedToken==null){
      toast.error("Login First!")
      router.push("/sign")
      return
    }
    setToken(storedToken as string);
    
  }, [token]);
  
  useEffect(() => {
    if (!token) return;
    setIsLoading(true)
    const fetchNumberOfTasksAndQueries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getNumber`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errData = await response.json();
          toast.error(errData.message)
          if(errData.message=="Invalid token. Please log in."){
            router.push("/sign")
          }
          if(errData.message=="Your Session has Expired, Login again"){
            router.push("/sign")
          }
          throw errData;
        }
        const data = await response.json();
        console.log(data);

        setQueryCount(data.query_count)
        setTaskCount(data.task_count)
        setUserCount(data.user_count)
      } catch (e) {
        console.log(e);

      }
      finally{
        setIsLoading(false)
      }
    };
    fetchNumberOfTasksAndQueries()
  },[token]);
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="relative min-h-screen flex bg-[#0f1117] overflow-hidden text-white font-sans">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-cyan-400/10 via-blue-500/5 to-transparent animate-pulse blur-3xl" />

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      {/* Main Dashboard Content */}
      <main className="relative z-10 flex-1 p-8 space-y-10 overflow-y-auto">
        {/* Splash Cursor Animation */}


        {/* Top Greeting Section */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent animate-fadeInUp">
            Welcome Back 👋
          </h1>
          <p className="text-lg text-slate-300 animate-fadeIn delay-200">
            Let’s get productive today!
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            icon={<Users size={28} />}
            label="Active Users"
            value={userCount.toString()}
          />
          <StatCard icon={<Folder size={28} />} label="Projects" value={taskCount.toString()} />
          <StatCard
            icon={<Activity size={28} />}
            label="Active Queries"
            value={queryCount.toString() }
          />
          <StatCard
            icon={<TrendingUp size={28} />}
            label="Engagement"
            value="89%"
          />
        </div>

        
      </main>
    </div>
  );
};

/* Small Component for Stats */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center backdrop-blur-lg hover:border-cyan-400 transition">
    <div className="text-cyan-300 mb-3">{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-slate-400 text-sm mt-1">{label}</p>
  </div>
);

export default MainDashboard;
