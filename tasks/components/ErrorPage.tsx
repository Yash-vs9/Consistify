"use client"
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import router, { useRouter } from "next/navigation"



interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const router=useRouter()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white px-4">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl text-center max-w-md w-full border border-cyan-500">
        <AlertTriangle className="text-cyan-400 w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-300 mb-4">{message}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-cyan-500 hover:bg-cyan-600 transition-colors text-white font-medium px-4 py-2 rounded-xl"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;