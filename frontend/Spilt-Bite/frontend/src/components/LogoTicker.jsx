import React from "react";

const LogoTicker = () => {
  const partners = [
    { name: "Zomato", logo: "/zomato.jpg" }, // Ensure these are in your public folder
    { name: "Swiggy", logo: "/swiggy.jpeg" },
    { name: "UberEats", logo: "/ubereats3.png" },
    { name: "DoorDash", logo: "/doordash.png" },
    { name: "FoodPanda", logo: "/foodpanda2.jpeg" },
  ];

  const tickerItems = [...partners, ...partners, ...partners];

  return (
    <div className="w-full py-12 overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-scroll gap-12 md:gap-24 items-center">
        {tickerItems.map((partner, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer gap-4 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300 group"
          >
            {/* Logo Wrapper - Added flex-shrink-0 */}
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-xl shadow-md border border-gray-100 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* Vendor Name - Added hover glow */}
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;
