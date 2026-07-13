import React from "react";

const LogoTicker = () => {
  const partners = [
    { name: "Zomato", logo: "/zomato.jpg" },
    { name: "Swiggy", logo: "/swiggy.jpeg" },
    { name: "UberEats", logo: "/ubereats3.png" },
    { name: "DoorDash", logo: "/doordash.png" },
    { name: "FoodPanda", logo: "/foodpanda2.jpeg" },
  ];

  const tickerItems = [...partners, ...partners, ...partners];

  return (
    <div className="w-full py-16 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-scroll gap-16 md:gap-32 items-center px-8">
        {tickerItems.map((partner, index) => (
          <div
            key={index}
            className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300 group cursor-default"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-2xl glass overflow-hidden border-white/5 group-hover:border-yellow-400/30 transition-colors duration-300">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white/50 group-hover:text-yellow-400 transition-colors duration-300">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;
