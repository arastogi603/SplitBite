import React from "react";
import { useNavigate } from "react-router-dom";

const GlassButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-6 p-10 justify-center items-center">
      {/* Join Room: Improved Glassmorphism */}
      <button
        onClick={() => navigate("/join")}
        className="px-8 py-3 bg-white/10 cursor-pointer backdrop-blur-md border border-white/30 text-white font-medium rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg"
      >
        Join Room
      </button>

      {/* Create New: Added Neon Glow and Border Effects */}
      <button
        onClick={() => navigate("/create")}
        className="px-8 py-3 bg-transparent cursor-pointer border-2 border-yellow-400 text-yellow-400 font-bold rounded-full transition-all duration-300 
                   hover:scale-110 hover:bg-yellow-400 hover:text-black active:scale-95
                   shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.8)]"
      >
        + Create New
      </button>
    </div>
  );
};

export default GlassButtons;
