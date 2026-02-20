import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Loader2, ListChecks, Receipt } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";

// Helper to keep the map centered [cite: 2026-02-12]
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => { if (coords) map.setView(coords, 16); }, [coords, map]);
  return null;
};

const TrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const currentUser = localStorage.getItem("userName");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) { console.error("Poll error:", err); }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [id]);

  const handleReceived = async () => {
    try { 
      await axios.post(`http://localhost:8080/api/orders/${id}/delivered`); 
    } catch (err) { alert("Status update failed"); }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      await axios.post(`http://localhost:8080/api/orders/${id}/verify-otp`, null, { 
        params: { otp: otpInput } 
      });
    } catch (err) { alert("Invalid OTP!"); } 
    finally { setIsVerifying(false); }
  };

  if (!order) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="text-yellow-400 animate-spin" /></div>;

  const isHost = order.hostName === currentUser || order.name === currentUser;
  const position = [order.latitude || 28.5355, order.longitude || 77.3910];

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[3rem] p-8 shadow-2xl relative">
        
        {order.status === "COMPLETED" ? (
          <div className="text-center py-10 animate-in zoom-in-95">
            <CheckCircle2 className="text-green-500 mx-auto mb-6" size={80} strokeWidth={3} />
            <h2 className="text-4xl font-black uppercase text-green-500 italic tracking-tighter">Split Success!</h2>
            <button onClick={() => navigate("/")} className="mt-10 w-full py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase">Close Session</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-yellow-400 uppercase italic">Live Track</h2>
              <span className="bg-yellow-400/10 text-yellow-400 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">#{id}</span>
            </div>

            {/* BILL BREAKDOWN */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase text-white/20 mb-1">Host Portion</p>
                  <p className="text-sm font-bold text-white/60">₹{order.hostPrice?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-white/20 mb-1">Your Portion</p>
                  <p className="text-sm font-bold text-white/60">₹{order.price?.toFixed(2) || "0.00"}</p>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Receipt size={14} className="text-white/40" />
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Total Food Cart</p>
                </div>
                <p className="text-xl font-black text-white">₹{order.totalCartValue?.toFixed(2)}</p>
              </div>
              
              <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black uppercase text-yellow-400 tracking-widest">
                    {isHost ? "Receive from Partner" : "Pay to Host"}
                  </p>
                  <p className="text-lg font-black text-yellow-400">₹{order.joinerAmount?.toFixed(2)}</p>
                </div>
                <p className="text-[7px] font-bold text-white/30 uppercase">Includes ₹2 Platform Fee</p>
              </div>
            </div>

            {/* PARTNER'S REQUEST */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks size={14} className="text-yellow-400" />
                <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">Partner's Request</p>
              </div>
              <p className="text-sm italic text-white/70 leading-relaxed">"{order.itemsRequested || "Waiting..."}"</p>
            </div>

            {/* MAP SECTION [cite: 2026-02-12] */}
            <div className="relative w-full h-40 bg-black rounded-[2rem] border border-white/10 overflow-hidden mb-6 grayscale invert brightness-50 contrast-125">
              <MapContainer center={position} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} />
                <RecenterMap coords={position} />
              </MapContainer>
            </div>

            {order.delivered ? (
              isHost ? (
                <div className="bg-white/5 p-6 rounded-[2rem] border border-yellow-400/30 text-center animate-in slide-in-from-bottom-5">
                  <p className="text-[10px] font-black uppercase mb-4 text-white/40 tracking-widest">Verify Partner's OTP</p>
                  <input type="text" maxLength="4" placeholder="----" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-black border-2 border-yellow-400 rounded-2xl py-4 text-center text-4xl font-black text-yellow-400 mb-4 outline-none" />
                  <button onClick={handleVerifyOtp} disabled={isVerifying} className="w-full py-4 bg-yellow-400 text-black rounded-2xl font-black uppercase text-xs">
                    {isVerifying ? "Verifying..." : "Finalize Split"}
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-400 text-black p-8 rounded-[2.5rem] text-center shadow-2xl animate-in slide-in-from-bottom-5">
                  <ShieldCheck className="mx-auto mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase mb-1 opacity-60">Handoff OTP</p>
                  {/* OTP visibility fix */}
                  <h1 className="text-6xl font-black tracking-tighter">{order.otp || "----"}</h1>
                  <p className="text-[8px] mt-4 font-bold uppercase opacity-60 italic">Show this to {order.hostName}</p>
                </div>
              )
            ) : (
              isHost && (
                <button onClick={handleReceived} className="w-full py-6 bg-yellow-400 text-black rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl shadow-yellow-400/10">
                  <CheckCircle2 size={20} strokeWidth={3} /> Confirm Food Received
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;