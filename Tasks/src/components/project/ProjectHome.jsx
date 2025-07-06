import React from 'react';
import '../../index.css';

const ProjectHome = () => {
  return (
    <div className="bg-[#11121a] min-h-screen w-full flex flex-col items-center justify-center px-6 py-8">
      <h1 className="text-white text-2xl font-bold mb-4 self-start ml-10">PROJECT</h1>

      <div className="bg-[#202230] h-[80vh] w-[80vw] flex border-2 border-white rounded-lg overflow-hidden shadow-lg">
        {/* Left Section */}
        <div className="w-1/2 px-8 py-6 flex flex-col justify-evenly text-lg text-[aliceblue] font-serif gap-4 bg-[#202230]">
          {['Name', 'Name', 'Description'].map((label, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="mb-1">{label}</label>
              <input
                type="text"
                className="w-full h-10 bg-[#202230] font-mono text-[aliceblue] text-base outline-none border-b-4 border-white focus:ring-0"
              />
            </div>
          ))}

          {/* Task Priority (Radio Buttons) */}
          <div className="flex flex-col gap-2">
            <label className="mb-1">Task Priority</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="priority" value="High" className="w-5 h-5 accent-cyan-500" />
                High
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="priority" value="Medium" className="w-5 h-5 accent-cyan-500" />
                Medium
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="priority" value="Low" className="w-5 h-5 accent-cyan-500" />
                Low
              </label>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-[rgba(238,229,217,0.737)] flex flex-col items-center justify-center gap-6 font-sans px-6 py-8">
          <h1 className="text-xl text-black font-semibold">Add Collaborators</h1>
          <input
            type="text"
            placeholder="Search From Friend List"
            className="h-10 w-3/4 bg-[#202230] text-white text-center font-mono border-2 border-white rounded outline-none"
          />
          <button className="bg-[#202230] text-white px-6 py-2 rounded border border-white hover:bg-[#648bce] transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHome;