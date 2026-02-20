import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      {/* Glass Container */}
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Contact Information */}
        <div className="p-8 md:p-12 bg-yellow-400/10 flex flex-col justify-center">
          <h2 className="text-4xl font-black text-yellow-400 mb-6 uppercase tracking-tighter">
            Contact <span className="text-white">Us</span>
          </h2>
          <p className="text-gray-200 mb-8 leading-relaxed">
            Have a question about your SplitBite session? We're here to help you
            get the best experience possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <span className="text-white font-medium">
                hello@splitbite.com
              </span>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                <Phone size={20} />
              </div>
              <span className="text-white font-medium">+1 (555) 123-4567</span>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <span className="text-white font-medium">
                123 Tech Square, SF
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="p-8 md:p-12 bg-black/20">
          <form className="space-y-5">
            <div>
              <label className="block text-yellow-400 text-sm font-bold mb-2 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-yellow-400 text-sm font-bold mb-2 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-yellow-400 text-sm font-bold mb-2 uppercase tracking-widest">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-all resize-none"
                placeholder="How can we help?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-400/20"
            >
              <Send
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
