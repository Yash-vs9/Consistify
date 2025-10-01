"use client";

import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useRouter } from "next/navigation";
import { Session } from '@supabase/supabase-js';


const Sign: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // <<<< ADDED
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  interface LoginBody{
    email: string ,
    password: string
  }
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        // optional: redirectTo: `${window.location.origin}/dashboard`
      });
      if (error) throw error;
      // Supabase will redirect the user automatically after login
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    const loginData : LoginBody={
      email: loginEmail,
      password: loginPassword,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      router.push("/dashboard");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false); // <<<< ADDED
    }
  };

  const registerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // <<<< ADDED
    const registerData = {
      username: username,
      email: registerEmail,
      password: registerPassword,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      router.push("/dashboard");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false); // <<<< ADDED
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
            className={`w-full ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-700"
            } text-white py-2 rounded-lg font-semibold transition`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Loading...
              </span>
            ) : active ? (
              "Register"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-sm text-gray-400 text-center mt-4">
          {active ? (
            <>
              Already have an account?{" "}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setActive(false)}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                Create account
              </button>
            </>
          )}
        </div>
        <div className="relative left-44 top-1">or</div>
        <div className="flex justify-center mt-4">
  <button
    onClick={handleGoogleLogin}
    className="flex items-center justify-center w-full max-w-sm px-4 py-3 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
  >
    {/* Google Icon */}
    <svg
      className="w-5 h-5 mr-3"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.6 0 19.7-8.1 19.7-19.5 0-1.3-.1-2.3-.3-3.3z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.4 16.1 18.9 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4 24 4c-7.9 0-14.7 4.6-17.7 11.3z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.2-1.8 14-5l-6.4-5.2C29.4 36 27 37 24 37c-5.3 0-9.7-3.6-11.3-8.5l-6.6 5.1C9.3 39.4 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.9-5.2 7-9.3 7-2.9 0-5.5-1.1-7.4-2.9l-6.6 5.1C14.3 39.4 19.7 44 24 44c11.6 0 19.7-8.1 19.7-19.5 0-1.3-.1-2.3-.3-3.3z"
      />
    </svg>

    <span className="font-medium">Sign in with Google</span>
  </button>
</div>
      </div>
    </div>
  );
};

export default Sign;
