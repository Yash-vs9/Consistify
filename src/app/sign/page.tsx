"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

const Sign: React.FC = () => {
  
  const [active, setActive] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  interface loginData {
    email: string;
    password: string;
  }
  interface registerData {
    username: string;
    email: string;
    password: string;
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData = {
      email: loginEmail,
      password: loginPassword,
    };
    const token=localStorage.getItem('authToken')
  if(token==null){
    return <div>Login first</div>
  }
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
      });
      console.log("hit")
      if(!response.ok){
        const errorData=await response.text();
        throw new Error(errorData)
      }
      const data = await response.json();
      localStorage.setItem('authToken',data.token)
      router.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  const registerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registerData = {
      username: username,
      email: registerEmail,
      password: registerPassword,
    };
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(registerData),
      });
      if(!response.ok){
        const errorData=await response.text();
        throw new Error(errorData)
      }
      const data = await response.json();
      localStorage.setItem('authToken',data.token)
      router.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#111827] font-poppins px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-10 left-10 animate-pulse z-0" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse z-0" />

      {/* Sign-in / Register Box */}
      <div className="w-full max-w-md p-8 bg-[#1f2937] rounded-2xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {active ? "Create an Account" : "Welcome Back"}
        </h2>

        <form
          onSubmit={active ? registerSubmit : handleLogin}
          className="space-y-4"
        >
          {active && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={active ? registerEmail : loginEmail}
            onChange={(e) =>
              active
                ? setRegisterEmail(e.target.value)
                : setLoginEmail(e.target.value)
            }
            required
            className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={active ? registerPassword : loginPassword}
            onChange={(e) =>
              active
                ? setRegisterPassword(e.target.value)
                : setLoginPassword(e.target.value)
            }
            required
            className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {active ? "Register" : "Sign In"}
          </button>
        </form>

        <div className="text-sm text-gray-400 text-center mt-4">
          {active ? (
            <>
              Already have an account?{" "}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setActive(false)}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setActive(true)}
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sign;
