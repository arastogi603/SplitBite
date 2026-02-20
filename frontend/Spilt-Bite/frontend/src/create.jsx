import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, User, DollarSign, ChevronRight, Loader2, MapPin } from "lucide-react";
import axios from "axios";

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    minutes: 30,
    price: "",
    latitude: null,
    longitude: null
  });

  const presets = [15, 30, 45, 60];

  // Capture location for the Radar [cite: 2026-02-10, 2026-02-12]
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // POLLING LOGIC: Detects when a partner joins
  useEffect(() => {
    let interval;
    if (isWaiting && orderId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
          
          // If status changes to LOCKED, trigger alerts and move to tracking
          if (res.data.status === "LOCKED") {
            // Haptic feedback for mobile
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            
            // Audio alert
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(() => console.log("Audio blocked"));

            clearInterval(interval);
            navigate(`/track/${orderId}`); // Matches TrackingPage.jsx
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isWaiting, orderId, navigate]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name, // Matches 'name' field in OrderRequestDTO
      restaurantName: "Nearby Restaurant",
      latitude: formData.latitude || 28.6139,
      longitude: formData.longitude || 77.2090,
      timeWindowMinutes: formData.minutes,
      price: parseFloat(formData.price) // Matches 'price' field in OrderRequestDTO
    };

    try {
      const response = await axios.post("http://localhost:8080/api/orders/create", payload);
      setOrderId(response.data.id);
      localStorage.setItem("userName", formData.name);
      setIsWaiting(true);
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend error. Is Java running on 8080?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white bg-black">
      
      {/* WAITING SCREEN OVERLAY [cite: 2026-02-12] */}
      {isWaiting && (
  <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
      <Loader2 className="text-yellow-400 animate-spin relative" size={80} strokeWidth={3} />
    </div>
    
    <h2 className="text-4xl font-black text-yellow-400 italic mb-4 uppercase tracking-tighter">
      Waiting for Partner
    </h2>
    
    <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold max-w-xs leading-relaxed mb-10">
      Radar active. Your session is now visible to nearby users.
    </p>

    {/* NEW: WHATSAPP SHARE BUTTON */}
    <button
      onClick={() => {
        const message = encodeURIComponent(
          `Hey! I'm starting a SplitBite session. Join my order using ID: #${orderId} at http://localhost:5173/join`
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
      }}
      className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-3xl font-black uppercase text-sm shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform"
    >
      <svg size={20} fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      Invite Friend
    </button>

    <div className="mt-8 px-6 py-2 border border-white/10 rounded-full text-[10px] text-yellow-400/50 font-bold uppercase tracking-widest">
      Order ID: #{orderId}
    </div>
  </div>
)}

      {/* FORM CONTAINER */}
      <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/20 blur-[80px] rounded-full" />

        <h2 className="text-3xl font-black text-yellow-400 mb-8 text-center tracking-tighter uppercase italic">
          Launch Session
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400/50" size={18} />
            <input
              type="text"
              placeholder="Your Name (Host)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-400/50 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400/80 font-bold text-sm uppercase tracking-widest">
                <Clock size={16} />
                <span>Expires In</span>
              </div>
              <span className="text-2xl font-black text-yellow-400">{formData.minutes}m</span>
            </div>
            <div className="flex justify-between gap-2">
              {presets.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setFormData({ ...formData, minutes: time })}
                  className={`flex-1 py-2 rounded-xl border transition-all duration-300 font-bold ${
                    formData.minutes === time
                      ? "bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-white/5 border-white/10 text-white/50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400">
              <DollarSign size={24} strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="0.00"
              value={formData.price}
              onChange={handlePriceChange}
              className="w-full bg-yellow-400/10 border-2 border-yellow-400/20 rounded-3xl py-6 pl-14 text-3xl font-black text-yellow-400 focus:outline-none focus:border-yellow-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-yellow-400 text-black font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Launch Session
            <ChevronRight size={20} />
          </button>
          
          <p className="text-[10px] text-center text-white/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <MapPin size={10} />
            GPS: {formData.latitude ? "Locked" : "Searching..."}
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;