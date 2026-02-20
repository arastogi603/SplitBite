import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Zap, ShoppingCart, X, Loader2 } from "lucide-react";
import axios from "axios";

const JoinPageExpanded = () => {
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [joinerData, setJoinerData] = useState({ price: "", items: "" });

  const fetchRadarData = async () => {
    // Fallback coordinates for Noida
    let lat = 28.5355;
    let lon = 77.3910;

    const getFeed = async (latitude, longitude) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/feed`, {
          params: { lat: latitude, lon: longitude }
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
        () => getFeed(lat, lon) // Fallback
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
      await axios.post(`http://localhost:8080/api/orders/${selectedOrder.id}/join`, null, {
        params: { 
          price: parseFloat(joinerData.price),
          items: joinerData.items 
        }
      });
      navigate(`/track/${selectedOrder.id}`);
    } catch (error) {
      alert("Error joining session. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black italic text-yellow-400 uppercase">Live Radar</h2>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Scanning Noida</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="animate-spin text-yellow-400" size={40} />
            <p className="text-[10px] uppercase font-bold text-white/20">Finding Hosts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyUsers.length > 0 ? nearbyUsers.map((user) => (
              <div key={user.id} className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 hover:border-yellow-400/30 transition-all group">
                <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-black font-black text-2xl">
                  {user.hostName?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl uppercase italic truncate">{user.hostName}</h3>
                  <p className="text-[10px] text-white/40 uppercase mb-4 tracking-widest">{user.restaurantName}</p>
                  <button onClick={() => { setSelectedOrder(user); setIsModalOpen(true); }} className="w-full py-3 bg-white/10 hover:bg-yellow-400 hover:text-black rounded-2xl transition-all font-black uppercase text-[10px]">Connect</button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <p className="text-white/20 font-black uppercase tracking-[0.5em]">Radar Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[50] flex items-end justify-center">
          <div className="bg-[#0f0f0f] w-full max-w-md p-8 rounded-t-[3rem] border-t-2 border-yellow-400 animate-in slide-in-from-bottom-20 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 rounded-lg text-black"><ShoppingCart size={20} /></div>
                <h3 className="text-xl font-black uppercase italic text-yellow-400">Join Order</h3>
              </div>
              <X onClick={() => setIsModalOpen(false)} className="text-white/20 cursor-pointer" />
            </div>

            <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Your Items</p>
            <textarea 
              placeholder="e.g. 1x Burger, 1x Coke"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm mb-6 h-24 outline-none focus:border-yellow-400 text-white"
              onChange={(e) => setJoinerData({...joinerData, items: e.target.value})}
            />

            <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Your Amount (₹)</p>
            <input 
              type="number"
              placeholder="Enter amount"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm mb-8 outline-none focus:border-yellow-400 text-white"
              onChange={(e) => setJoinerData({...joinerData, price: e.target.value})}
            />

            <button onClick={submitJoinRequest} className="w-full py-5 bg-yellow-400 text-black font-black rounded-3xl uppercase active:scale-95 transition-all">Confirm Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinPageExpanded;