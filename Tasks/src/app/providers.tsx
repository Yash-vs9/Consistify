"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-[#0f172a] text-cyan-300 shadow-lg rounded-lg px-4 py-3 border border-cyan-400"
        className="text-sm"
        progressClassName="bg-cyan-500"
      />
      {children}
    </>
  );
}