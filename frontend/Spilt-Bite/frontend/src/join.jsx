import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Zap, ShoppingCart, X, Loader2, ArrowLeft, Radar } from "lucide-react";
import axios from "axios";
import { AuthContext } from "./components/AuthContext";

const JoinPageExpanded = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [joinerData, setJoinerData] = useState({ price: "", items: "" });

  const fetchRadarData = async () => {
    // Fallback coordinates
    let lat = 28.5355;
    let lon = 77.3910;

    const getFeed = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://splitbite-backend.onrender.com/api/orders/feed`, {
          params: { lat: latitude, lon: longitude },
          headers: { Authorization: `Bearer ${token}` }
        });
        setNearbyUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Radar Error:", error);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getFeed(pos.coords.latitude, pos.coords.longitude),
        () => getFeed(lat, lon)
      );
    } else {
      getFeed(lat, lon);
    }
  };

  useEffect(() => {
    fetchRadarData();
    const interval = setInterval(fetchRadarData, 10000);
    return () => clearInterval(interval);
  }, []);

  const submitJoinRequest = async () => {
    if (!joinerData.price || !joinerData.items) return alert("Fill all fields!");
    try {
      await axios.post(`https://splitbite-backend.onrender.com/api/orders/${selectedOrder.id}/join`, null, {
        params: { 
          price: parseFloat(joinerData.price),
          items: joinerData.items 
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/track/${selectedOrder.id}`);
    } catch (error) {
      alert("Error joining session. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink-base)] relative overflow-hidden font-sans selection:bg-yellow-400/30 selection:text-yellow-100 flex flex-col">
      
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-[80vw] h-[80vh] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-4xl max-h-4xl border border-white/5 rounded-full pointer-events-none animate-[ping_10s_cubic-bezier(0,0,0.2,1)_infinite]" />
      
      {/* Navigation Bar */}
      <div className="relative w-full p-6 z-20 flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </Link>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">Scanning Area</span>
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pb-20 relative z-10 flex flex-col animate-stagger-1">
        
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4">Live Radar</h1>
          <p className="text-white/50 text-lg max-w-xl">Discover nearby SplitBite sessions and jump into a shared order instantly.</p>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full animate-pulse" />
              <Radar className="text-yellow-400 animate-spin-slow relative z-10" size={64} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/40">Searching for hosts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyUsers.length > 0 ? nearbyUsers.map((user, idx) => (
              <div 
                key={user.id} 
                className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300 hover:border-yellow-400/30 hover:shadow-[0_20px_40px_-15px_rgba(250,204,21,0.1)]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-inner">
                    {user.hostName?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {user.restaurantName === "McDonald's" ? "🍔" : 
                         user.restaurantName === "Domino's" ? "🍕" : 
                         user.restaurantName === "Starbucks" ? "☕" : 
                         user.restaurantName === "Taco Bell" ? "🌮" : "🍽️"}
                      </span>
                      <h3 className="font-bold text-xl text-white truncate">{user.restaurantName || "Nearby Restaurant"}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <p className="text-sm truncate">Host: {user.hostName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10">
                  <button 
                    onClick={() => { setSelectedOrder(user); setIsModalOpen(true); }} 
                    className="w-full py-3.5 bg-white/5 hover:bg-yellow-400 text-white hover:text-black rounded-xl transition-all duration-300 font-bold tracking-wide active:scale-[0.98]"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center glass rounded-3xl border-dashed">
                <Radar size={48} className="text-white/20 mb-4" />
                <p className="text-xl font-bold text-white mb-2">No Active Sessions</p>
                <p className="text-white/40 max-w-sm">There are no orders nearby right now. Be the first to host one!</p>
                <Link to="/create" className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors">
                  Host a Session
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Join Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg glass-card p-8 sm:p-10 shadow-2xl animate-stagger-1 z-10 border-yellow-400/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-600" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Join Order</h3>
                <p className="text-white/50 text-sm">Add your items to {selectedOrder?.hostName}'s cart.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Your Items</label>
                <textarea 
                  placeholder="e.g. 1x Burger, 1x Fries"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all duration-300 min-h-[100px] resize-y"
                  onChange={(e) => setJoinerData({...joinerData, items: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Your Total Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all duration-300"
                    onChange={(e) => setJoinerData({...joinerData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={submitJoinRequest} 
                  className="group relative w-full py-4 bg-yellow-400 text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:bg-yellow-300 active:scale-[0.98] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-lg">Confirm & Join</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinPageExpanded;