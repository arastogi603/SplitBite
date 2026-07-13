import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";

const GlassButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-8 justify-center items-center w-full max-w-lg mx-auto">
      {/* Create New: Primary Action */}
      <button
        onClick={() => navigate("/create")}
        className="group relative flex-1 w-full flex justify-center items-center gap-3 px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl transition-all duration-300 hover:bg-yellow-300 active:scale-[0.98] shadow-[0_0_40px_rgba(250,204,21,0.2)] hover:shadow-[0_0_60px_rgba(250,204,21,0.4)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <Plus size={20} strokeWidth={2.5} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
        <span className="relative z-10 tracking-wide">Create Session</span>
      </button>

      {/* Join Room: Secondary Action */}
      <button
        onClick={() => navigate("/join")}
        className="group flex-1 w-full flex justify-center items-center gap-3 px-8 py-4 glass text-white font-medium rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
      >
        <Users size={20} className="text-white/70 group-hover:text-white transition-colors" />
        <span className="tracking-wide">Join Room</span>
      </button>
    </div>
  );
};

export default GlassButtons;
