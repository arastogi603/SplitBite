import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Loader2, ListChecks, Receipt, ArrowLeft, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import { AuthContext } from "./components/AuthContext";

// Helper to keep the map centered
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => { if (coords) map.setView(coords, 16); }, [coords, map]);
  return null;
};

const TrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const currentUser = localStorage.getItem("userName");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`https://splitbite-backend.onrender.com/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) { console.error("Poll error:", err); }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [id]);

  const handleReceived = async () => {
    try { 
      await axios.post(`https://splitbite-backend.onrender.com/api/orders/${id}/delivered`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { alert("Status update failed"); }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      await axios.post(`https://splitbite-backend.onrender.com/api/orders/${id}/verify-otp`, null, { 
        params: { otp: otpInput },
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { alert("Invalid OTP!"); } 
    finally { setIsVerifying(false); }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center">
        <Loader2 className="text-yellow-400 animate-spin mb-4" size={48} strokeWidth={2} />
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase">Connecting to Session...</p>
      </div>
    );
  }

  const isHost = order.hostName === currentUser || order.name === currentUser;
  const position = [order.latitude || 28.5355, order.longitude || 77.3910];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink-base)] relative overflow-hidden font-sans flex flex-col items-center px-4 py-8">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <div className="w-full max-w-md mb-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300">
          <ArrowLeft size={20} />
          <span className="font-medium">Exit Session</span>
        </Link>
      </div>

      <div className="w-full max-w-md glass-card p-6 sm:p-8 relative z-10">
        
        {order.status === "COMPLETED" ? (
          <div className="text-center py-12 animate-stagger-1">
            <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Split Success!</h2>
            <p className="text-white/50 mb-8">The bill has been settled and food is handed off.</p>
            <button 
              onClick={() => navigate("/")} 
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-white transition-all active:scale-[0.98]"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="animate-stagger-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  {order.restaurantName === "McDonald's" ? "🍔 " : 
                   order.restaurantName === "Domino's" ? "🍕 " : 
                   order.restaurantName === "Starbucks" ? "☕ " : 
                   order.restaurantName === "Taco Bell" ? "🌮 " : "🍽️ "}
                  {order.restaurantName || "Live Track"}
                </h2>
                <p className="text-white/50 text-sm">
                  {isHost 
                    ? (order.name ? `Session joined by ${order.name}` : "Waiting for partner...")
                    : `Session led by ${order.hostName}`
                  }
                </p>
              </div>
              <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                #{id.substring(0, 8)}
              </div>
            </div>

            {/* BILL BREAKDOWN */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-white/40 mb-1 tracking-wider">Host Portion</p>
                  <p className="text-lg font-bold text-white/80">₹{order.hostPrice?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase text-white/40 mb-1 tracking-wider">Your Portion</p>
                  <p className="text-lg font-bold text-white/80">₹{order.price?.toFixed(2) || "0.00"}</p>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-white/40" />
                  <p className="text-xs font-semibold uppercase text-white/50 tracking-wider">Total Cart Value</p>
                </div>
                <p className="text-xl font-bold text-white">₹{order.totalCartValue?.toFixed(2)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 border border-yellow-400/20 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 blur-2xl rounded-full" />
                <div className="flex justify-between items-center mb-1 relative z-10">
                  <p className="text-xs font-bold uppercase text-yellow-400 tracking-wider">
                    {isHost ? "Receive from Partner" : "Pay to Host"}
                  </p>
                  <p className="text-2xl font-black text-yellow-400">
                    ₹{isHost 
                       ? order.price?.toFixed(2) 
                       : order.joinerAmount?.toFixed(2)}
                  </p>
                </div>
                {!isHost && (
                  <p className="text-[10px] font-medium text-white/40 uppercase relative z-10">Includes ₹2 Platform Fee</p>
                )}
              </div>
            </div>

            {/* PARTNER'S REQUEST */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 flex gap-4 items-start">
              <div className="p-2 bg-yellow-400/10 rounded-xl shrink-0 mt-0.5">
                <ListChecks size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-white/40 tracking-wider mb-1">Partner's Request</p>
                <p className="text-sm font-medium text-white/80 leading-relaxed">
                  "{order.itemsRequested || "Waiting for items..."}"
                </p>
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="relative w-full h-48 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden mb-8 shadow-inner">
              <div className="absolute top-3 left-3 z-[1000] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                <Navigation size={12} className="text-yellow-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Meetup Point</span>
              </div>
              <div className="w-full h-full grayscale invert-[0.9] hue-rotate-[200deg] contrast-125 opacity-70">
                <MapContainer center={position} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} />
                  <RecenterMap coords={position} />
                </MapContainer>
              </div>
            </div>

            {/* ACTION SECTION */}
            {order.delivered ? (
              isHost ? (
                <div className="bg-white/5 p-6 rounded-3xl border border-yellow-400/30 text-center animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full pointer-events-none" />
                  <p className="text-xs font-bold uppercase mb-4 text-white/50 tracking-wider">Verify Partner's OTP</p>
                  <input 
                    type="text" 
                    maxLength="4" 
                    placeholder="----" 
                    value={otpInput} 
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-black/50 border-2 border-yellow-400/50 focus:border-yellow-400 rounded-2xl py-4 text-center text-4xl font-mono font-bold text-yellow-400 mb-4 outline-none transition-colors shadow-inner tracking-[0.5em]" 
                  />
                  <button 
                    onClick={handleVerifyOtp} 
                    disabled={isVerifying || otpInput.length !== 4} 
                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:hover:bg-yellow-400 text-black rounded-xl font-bold uppercase text-sm transition-all active:scale-[0.98]"
                  >
                    {isVerifying ? "Verifying..." : "Finalize Split"}
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black p-8 rounded-3xl text-center shadow-[0_10px_40px_-10px_rgba(250,204,21,0.5)] animate-in slide-in-from-bottom-4 duration-500">
                  <ShieldCheck className="mx-auto mb-3" size={36} strokeWidth={2.5} />
                  <p className="text-xs font-bold uppercase mb-2 opacity-80 tracking-wider">Handoff OTP</p>
                  <h1 className="text-6xl font-mono font-black tracking-widest">{order.otp || "----"}</h1>
                  <div className="mt-6 pt-4 border-t border-black/10">
                    <p className="text-xs font-bold uppercase opacity-80">Show this to {order.hostName}</p>
                  </div>
                </div>
              )
            ) : (
              isHost && (
                <button 
                  onClick={handleReceived} 
                  className="w-full py-5 bg-white text-black hover:bg-yellow-400 rounded-2xl font-bold uppercase text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all duration-300 active:scale-[0.98]"
                >
                  <CheckCircle2 size={20} strokeWidth={2.5} /> Confirm Food Received
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;