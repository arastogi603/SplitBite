import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Added useNavigate
import CreateSessionPage from "./create";
import JoinPageExpanded from "./join";
import TrackingPage from "./TrackingPage"; 
import { Zap, PlusCircle, Radar } from "lucide-react"; // Matching your icon style

// 1. NEW: Professional Home Component
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
        <h1 className="text-7xl font-black text-yellow-400 italic tracking-tighter uppercase relative">
          SplitBite
        </h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.5em] mt-2">
          Hyperlocal Bill Splitting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => navigate("/create")}
          className="group bg-yellow-400 hover:bg-yellow-300 text-black p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 shadow-xl shadow-yellow-400/10"
        >
          <PlusCircle size={40} strokeWidth={2.5} />
          <span className="font-black uppercase tracking-widest text-sm">Host Session</span>
        </button>

        <button 
          onClick={() => navigate("/join")}
          className="group bg-white/5 border border-white/10 hover:border-yellow-400/50 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4"
        >
          <Radar size={40} strokeWidth={2.5} className="text-yellow-400 animate-pulse" />
          <span className="font-black uppercase tracking-widest text-sm text-white">Join Nearby</span>
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Routes>
        {/* NEW: Landing Page at Root */}
        <Route path="/" element={<Home />} />

        {/* Updated Paths */}
        <Route path="/create" element={<CreateSessionPage />} />
        <Route path="/join" element={<JoinPageExpanded />} />
        <Route path="/track/:id" element={<TrackingPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;