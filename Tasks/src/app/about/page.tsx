'use client';
import { Brain, CheckCircle, MessageCircle, Users, Bot } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      
      {/* Glowing Background */}
      <div className="absolute inset-0 animate-pulse opacity-25 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.4),transparent_70%)]"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          About <span className="text-blue-400">Consistify</span>
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
          Consistify is your all-in-one productivity hub — seamlessly combining task management, 
          real-time chat, and AI-powered tools to keep you and your friends on track.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Task Management */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <CheckCircle className="w-10 h-10 text-green-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Task Management</h3>
            <p className="text-white/60 text-sm">
              Organize your day, set deadlines, and track progress with a simple yet powerful task system.
            </p>
          </div>

          {/* Chat with Friends */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <MessageCircle className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Chat with Friends</h3>
            <p className="text-white/60 text-sm">
              Stay connected, share updates, and collaborate in real-time with your friends and teammates.
            </p>
          </div>

          {/* AI Query Solver */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Brain className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Query Solver</h3>
            <p className="text-white/60 text-sm">
              Got a question? Our AI-powered engine provides instant, smart solutions so you never get stuck.
            </p>
          </div>

          {/* AI Bot Feature */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <Bot className="w-10 h-10 text-pink-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Bot Assistant</h3>
            <p className="text-white/60 text-sm">
              Your personal AI bot is always ready to help — from answering questions to suggesting the next steps in your workflow.
            </p>
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-16">
          <Users className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
          <h2 className="text-3xl font-bold text-white mb-4">Built for Teams & Communities</h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Whether you're working solo or with a team, Consistify empowers you to stay productive, 
            communicate seamlessly, and solve problems faster — all in one platform.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition shadow-lg"
          >
            Get Started with Consistify
          </a>
        </div>
      </div>
    </div>
  );
}