'use client'
import { ToastContainer } from "react-toastify";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import './globals.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">

      <body>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-[#0f172a] text-cyan-300 shadow-lg rounded-lg px-4 py-3 border border-cyan-400"
        className="text-sm"
        progressClassName="bg-cyan-500"
      />
        <Navbar/>


        {children}
      </body>
    </html>
  );
}
