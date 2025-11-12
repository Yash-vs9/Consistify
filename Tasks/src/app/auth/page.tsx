'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useRouter } from 'next/navigation';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1️⃣ Get session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      if (!data.session) {
        console.error('No session found, redirecting to login...');
        router.push('/sign'); // redirect if no session
        return;
      }
      setSession(data.session);
    };
    getSession();
  }, [router]);

  // 2️⃣ Submit username + session info to backend
  const handleSubmit = async () => {
    if (!username) {
      alert('Please enter a username');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          username,
          access_token: session.access_token,
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData);
      }

      const data = await response.json();
      console.log('User saved:', data);
      localStorage.setItem("authToken",data.token)
      router.push('/dashboard'); // redirect after successful submit
    } catch (err) {
      console.error(err);
      alert('Failed to submit username');
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Render username input modal
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Choose a Username</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded text-black"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;