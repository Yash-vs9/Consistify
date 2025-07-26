"use client"
import { useEffect, useState } from 'react'

export default function Profile() {
  const [token,setToken]=useState<string>("")
  const [name,setName]=useState<string>("")
  const [xp,setXp]=useState<string>("")
  const [countFriends,setCountFriends]=useState<number>(0)
  const [countTasks,setCountTasks]=useState<number>(0)
  useEffect(()=>{

    const storedToken=localStorage.getItem("authToken")

    setToken(storedToken as string)
  },[token])
  useEffect(()=>{
    if(!token) return
    const fetchProfile=(async()=>{
      try{
        console.log("FDDS")

        const response=await fetch("http://localhost:8080/profile",{
          method:"GET",
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
          }
        })
        if(!response.ok){
          const errData=await response.text()
          throw new Error(errData)
        }
        const data=await response.json()
        console.log(data)
        setName(data[0][0])
        setXp(data[0][1])
        setCountFriends(data[0][2])
        setCountTasks(data[0][3])

      }
      catch(e){
        console.log(e);
      }
     
    })
    fetchProfile()

  },[token])
  return (
    
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto mt-12 rounded-xl shadow-lg bg-gray-900 p-8 text-white">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
        
          <div>
            <h1 className="text-3xl font-bold mb-1">{name}</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">

                <span className="ml-2 text-yellow-300 font-semibold text-lg">Diamond League</span>
              </div>
            </div>
            <p className="text-gray-400 font-medium">FPS Specialist | #PC | #RPG | #Shooter</p>
          </div>
        </div>

        {/* Stat Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{countTasks}</div>
            <div className="text-xs text-gray-300">Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{xp}</div>
            <div className="text-xs text-gray-300">XP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">23</div>
            <div className="text-xs text-gray-300">Level</div>
          </div>
        </div>

        {/* Followers and Badges */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xl font-bold text-pink-400">{countFriends}</span>
            <span className="ml-2 text-gray-300">Followers</span>
          </div>
          <div className="flex space-x-2">
            {/* Example: League Badges */}

          </div>
        </div>

        {/* League Progress */}
        <div className="mb-8">
          <h2 className="text-xl text-yellow-300 font-bold mb-1">League Progress</h2>
          <div className="w-full bg-gray-700 rounded-full h-5">
            <div className="bg-yellow-400 h-5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-400">
            <span>Gold</span>
            <span>Platinum</span>
            <span>Diamond</span>
          </div>
        </div>

        {/* Recent Games */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-purple-300">Recent Games</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">

              <div className="font-semibold mt-2">Apex Legends</div>
              <span className="text-xs text-gray-400">Platinum III</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">

              <div className="font-semibold mt-2">The Witcher 3</div>
              <span className="text-xs text-gray-400">100% Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
