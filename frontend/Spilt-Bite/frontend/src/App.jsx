import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import CreateSessionPage from "./create";
import JoinPageExpanded from "./join";
import TrackingPage from "./TrackingPage"; 
import Navbar from "./components/Navbar";
import LogoTicker from "./components/LogoTicker";
import GlassButtons from "./components/GlassButtons";
import ScrollSequence from "./components/ScrollSequence";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from "./components/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ArrowRight, UtensilsCrossed, Receipt, Users } from "lucide-react";

const Home = () => {
  return (
    <>
      <ScrollSequence />
      <div className="min-h-screen bg-transparent text-[var(--color-ink-base)] relative overflow-hidden flex flex-col font-sans">
        
        {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-yellow-400/10 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-900/10 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 z-10">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-stagger-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            The New Way to Split Food
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
            Share the meal.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Not the math.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            SplitBite removes the financial friction from group dining. Pool orders to slash delivery fees, instantly calculate who owes what, and maintain group harmony effortlessly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full mt-12 animate-stagger-2">
          <GlassButtons />
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4 animate-stagger-3">
          {[
            { icon: UtensilsCrossed, title: "Pool Orders", desc: "Combine orders to hit minimums and eliminate multiple delivery fees." },
            { icon: Receipt, title: "Instant Math", desc: "Tax, tip, and itemized splits are calculated automatically. No spreadsheets." },
            { icon: Users, title: "Social Harmony", desc: "No more awkward Venmo requests. Everyone pays their exact fair share." }
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl flex flex-col items-start text-left gap-4 hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Logo Ticker */}
        <div className="w-full mt-24 border-t border-white/5 pt-12 animate-stagger-3">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/30 mb-8">Supported Platforms</p>
          <LogoTicker />
        </div>

      </main>
      </div>
    </>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
      <AuthProvider>
        <div className="bg-[var(--color-background)] min-h-screen text-[var(--color-ink-base)] selection:bg-yellow-400/30 selection:text-yellow-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreateSessionPage />} />
            <Route path="/join" element={<JoinPageExpanded />} />
            <Route path="/track/:id" element={<TrackingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;