"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react";

type Query = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function Home() {

  
  const [queries, setQueries] = useState<Query[]>([]);
  const [token,setToken]=useState<string>("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }



//   function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     const sendXPRequest = () => {
//     if (typeof window !== 'undefined' && window.botpress) {
//       console.log("trigger");
//       window.botpress.sendEvent({
//         type: 'trigger',
//         channel: 'web',
//         payload: {
//           type: 'xp_request',
//           tasks: [
//             { name: 'DSA', description: 'arrays and sorting' },
//             { name: 'UI Design', description: 'responsive layout' },
//             { name: 'Website Development',description: 'responsive page and full workable'}
//           ]
//         }
//       });
//     } else {
//       console.warn('Botpress not ready');
//     }
//   };
//     sendXPRequest()
//     e.preventDefault();
//     if (!form.title.trim() || !form.description.trim()) return;

//     setQueries([
//       { ...form, id: Date.now() },
//       ...queries,
//     ]);

//     setForm({ title: "", description: "", category: "General" });
//   }
  useEffect(()=>{
    const storedToken=localStorage.getItem("authToken")
    setToken(storedToken as string)
  })
  const handleSubmit=(async(e: FormEvent<HTMLFormElement>)=>{
    const body={
      queryName:form.title,
      description:form.description

    }
    e.preventDefault()
    if(!token) return
    
    try{
      const response=await fetch("http://localhost:8080/query/create",
        {
          method:"POST",
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify(body)
        }
      )
      if(!response.ok){
        const errData=await response.text()
        throw new Error(errData)
      }
      const data=response.text()
      console.log(data)
    }
    catch(e){
      console.log(e)
    }
  })

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 transition-all">
      {/* Glow effect */}
      <div
        className="absolute -z-10"
        aria-hidden
      >
        <div className="w-[600px] h-[400px] bg-blue-400 blur-3xl opacity-30 rounded-full absolute -top-24 left-1/2 -translate-x-1/2" />
        <div className="w-[400px] h-[200px] bg-indigo-400 blur-2xl opacity-25 rounded-full absolute -bottom-10 left-1/3" />
      </div>
      <main className="relative max-w-xl w-full mx-auto bg-white/90 dark:bg-gray-900/80 mt-20 p-8 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800 backdrop-blur-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 drop-shadow-sm">
            Submit Your Query
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Have a question? Need a review? Submit below for the community!
          </p>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-8">
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-100" htmlFor="title">
              Title <span className="text-blue-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              className="mt-1 block w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition focus:(outline-none border-blue-400 ring-2 ring-blue-200) placeholder:italic"
              maxLength={80}
              required
              autoComplete="off"
              placeholder="Short summary of your query..."
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-100" htmlFor="description">
              Description <span className="text-blue-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 block w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] transition focus:(outline-none border-blue-400 ring-2 ring-blue-200) placeholder:italic"
              required
              placeholder="Describe your question or what you want reviewed..."
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-100" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="block w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 mt-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition focus:(outline-none border-blue-400 ring-2 ring-blue-200)"
              value={form.category}
              onChange={handleChange}
            >
              <option>General</option>
              <option>Programming</option>
              <option>Design</option>
              <option>Career</option>
              <option>Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-lg py-3 transition-all duration-150 shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Submit Query
          </button>
        </form>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-blue-200 mb-3">
            Recent Queries

          </h2>
          <ul>
            {queries.length === 0 && (
              <p className="text-gray-400 dark:text-gray-500">No queries yet.</p>
            )}
            {queries.map((q) => (
              <li key={q.id} className="border-b border-gray-100 dark:border-gray-800 py-3">
                <div className="flex items-center">
                  <span className="font-semibold text-blue-800 dark:text-blue-300 text-base">{q.title}</span>
                  <span className="ml-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded transition-all">
                    {q.category}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">{q.description}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>

    </div>
  );
}