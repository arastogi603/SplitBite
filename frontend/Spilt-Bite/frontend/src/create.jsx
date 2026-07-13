import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock, User, DollarSign, ChevronRight, Loader2, MapPin, ArrowLeft } from "lucide-react";
import axios from "axios";
import { AuthContext } from "./components/AuthContext";

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [isWaiting, setIsWaiting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(false);
  
  const [formData, setFormData] = useState({
    restaurantName: "",
    minutes: 30,
    price: "",
    latitude: null,
    longitude: null
  });

  const presets = [15, 30, 45, 60];

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

  useEffect(() => {
    let interval;
    if (isWaiting && orderId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data.status === "LOCKED") {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(() => console.log("Audio blocked"));
            clearInterval(interval);
            navigate(`/track/${orderId}`);
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
    const hostName = user?.email ? user.email.split('@')[0] : "Host";
    const payload = {
      name: hostName,
      restaurantName: formData.restaurantName,
      latitude: formData.latitude || 28.6139,
      longitude: formData.longitude || 77.2090,
      timeWindowMinutes: formData.minutes,
      price: parseFloat(formData.price)
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/create", 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderId(response.data.id);
      localStorage.setItem("userName", hostName);
      setIsWaiting(true);
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend error. Are you logged in and is Java running?");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink-base)] relative overflow-hidden flex flex-col font-sans selection:bg-yellow-400/30 selection:text-yellow-100">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-yellow-400/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 w-full p-6 z-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      {/* Waiting Screen Overlay */}
      {isWaiting && (
        <div className="fixed inset-0 z-[100] bg-[var(--color-background)]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-10 text-center transition-all duration-500">
          <div className="relative mb-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[60px] rounded-full animate-pulse" />
            <div className="w-32 h-32 border border-yellow-400/30 rounded-full flex items-center justify-center relative">
              <div className="absolute w-full h-full border border-yellow-400/10 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <Loader2 className="text-yellow-400 animate-spin relative z-10" size={48} strokeWidth={2} />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Waiting for Partner
          </h2>
          
          <p className="text-white/50 text-sm sm:text-base font-medium max-w-sm leading-relaxed mb-12">
            Radar active. Your session is visible to nearby users.
          </p>

          <button
            onClick={() => {
              const message = encodeURIComponent(
                `Hey! I'm starting a SplitBite session. Join my order using ID: #${orderId} at http://localhost:5173/join`
              );
              window.open(`https://wa.me/?text=${message}`, "_blank");
            }}
            className="flex items-center gap-3 bg-white text-black hover:bg-yellow-400 px-8 py-4 rounded-2xl font-bold transition-all duration-300 active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]"
          >
            <svg size={20} fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Invite via WhatsApp
          </button>

          <div className="mt-8 px-6 py-2 border border-white/10 rounded-full text-xs text-white/40 font-mono tracking-widest">
            ID: <span className="text-white/80">#{orderId}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 animate-stagger-1">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">Host a Session</h1>
          <p className="text-white/50 text-sm sm:text-base max-w-sm mx-auto">Set up your shared order and let nearby friends join instantly.</p>
        </div>

        <div className="glass-card w-full max-w-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Restaurant Dropdown & Input */}
            <div className="space-y-2 relative">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Restaurant</label>
              
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-4 pr-2 flex items-center justify-between transition-colors focus-within:border-yellow-400/50 focus-within:bg-white/10">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl pointer-events-none">
                    {formData.restaurantName === "McDonald's" ? "🍔" : 
                     formData.restaurantName === "Domino's" ? "🍕" : 
                     formData.restaurantName === "Starbucks" ? "☕" : 
                     formData.restaurantName === "Taco Bell" ? "🌮" : "🍽️"}
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Local Pizzeria"
                    className="w-full bg-transparent text-white font-medium placeholder-white/20 focus:outline-none py-2"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    onFocus={() => setShowRestaurants(true)}
                    required
                  />
                </div>
                <div 
                  className="p-2 cursor-pointer hover:bg-white/10 rounded-xl"
                  onClick={() => setShowRestaurants(!showRestaurants)}
                >
                  <ChevronRight className={`text-white/50 transition-transform ${showRestaurants ? 'rotate-90' : ''}`} size={18} />
                </div>
              </div>

              {showRestaurants && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl overflow-hidden">
                  {["McDonald's", "Domino's", "Starbucks", "Taco Bell", "Subway"].map(chain => (
                    <div 
                      key={chain}
                      className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, restaurantName: chain });
                        setShowRestaurants(false);
                      }}
                    >
                      <span className="text-2xl">
                        {chain === "McDonald's" ? "🍔" : 
                         chain === "Domino's" ? "🍕" : 
                         chain === "Starbucks" ? "☕" : 
                         chain === "Taco Bell" ? "🌮" : "🥪"}
                      </span>
                      <span className="text-white font-medium">{chain}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time Window */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 mb-1">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Session Window</label>
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Clock size={14} />
                  <span className="text-sm font-bold">{formData.minutes}m</span>
                </div>
              </div>
              <div className="flex justify-between gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                {presets.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, minutes: time })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      formData.minutes === time
                        ? "bg-white text-black shadow-md scale-[1.02]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Price Estimate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Estimated Total ($)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <DollarSign size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 text-2xl font-bold text-white placeholder-white/10 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full py-4 bg-yellow-400 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] hover:bg-yellow-300 active:scale-[0.98] transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-lg">Launch Session</span>
                <ChevronRight size={20} strokeWidth={2.5} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-white/30 font-medium">
              <MapPin size={12} className={formData.latitude ? "text-yellow-400" : "animate-pulse"} />
              {formData.latitude ? "GPS Signal Locked" : "Acquiring GPS Signal..."}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateSessionPage;