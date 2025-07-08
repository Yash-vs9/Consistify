import React, { useEffect, useState } from 'react';
import '../../index.css';
import { fetchFriends } from '../../features/friendSlice/friendSlice';
import { createTask } from '../../features/taskSlice/taskSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProjectHome = () => {
  const token = localStorage.getItem('authToken');
  if(!token){
    alert("Login")
  }
  const [taskName, setTaskName] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [collaborators, setCollaborators] = useState([]);

  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.friends);
  const error = useSelector((state) => state.friend.error);
  const status = useSelector((state) => state.friend.status);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);

  const createTaskButton=(async (e)=>{
    e.preventDefault()
    const data={
      taskName:taskName,
      startingDate:startingDate,
      lastDate:lastDate,
      taskPriority:taskPriority,
      collaborators:collaborators
    }
    try{
      const res=await dispatch(createTask(data)).unwrap()
      console.log(res)
    }
    catch(err){
      console.log(err)
    }
  })
    
  
  useEffect(() => {
    if (status === 'idle' && token) {
      dispatch(fetchFriends(token));
    }
  }, [dispatch, token, status]);
  

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredFriends(
      friends.filter((friend) =>
        friend.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleSelect = (friend) => {
    setSearchTerm('');
    setFilteredFriends([]);
    // Avoid duplicates
    if (!collaborators.find((f) => f === friend)) {
      setCollaborators([...collaborators, friend]);
    }
  };

  return (
    <div className="bg-[#11121a] min-h-screen w-full flex flex-col items-center justify-center px-6 py-8">
      <h1 className="text-white text-2xl font-bold mb-4 self-start ml-10">PROJECT</h1>

      <div className="bg-[#202230] h-[80vh] w-[80vw] flex border-2 border-white rounded-lg overflow-hidden shadow-lg">
        
        {/* Left Section */}
        <div className="w-1/2 px-8 py-6 flex flex-col justify-evenly text-lg text-[aliceblue] font-serif gap-4">
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
          <h1 className="text-xl font-semibold">Add Collaborators</h1>

          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search from friend list"
            className="h-10 w-full bg-[#2b2d3a] text-white text-center font-mono border-2 border-white rounded outline-none"
          />

          {searchTerm && filteredFriends.length > 0 && (
            <ul className="bg-[#2a2c3a] border border-white rounded text-white shadow-lg max-h-70 overflow-y">
              {filteredFriends.map((friend) => (
                <li
                  key={friend}
                  onClick={() => handleSelect(friend)}
                  className="px-4 py-2 h-9 cursor-pointer hover:bg-[#4b4e63] transition"
                >
                  {friend}
                </li>
              ))}
            </ul>
          )}

          {collaborators.length > 0 && (
            <div className="text-sm mt-2 h-[10vh]">
              <p className="font-semibold">Selected Collaborators:</p>
              <ul className="list-disc list-inside text-cyan-400">
                {collaborators.map((friend) => (
                  <li key={friend}>{friend}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="bg-[#202230] text-white px-6 py-2 rounded border border-white hover:bg-[#648bce] transition" onClick={(e)=>createTaskButton(e)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHome;