import React, { useState } from "react";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Contact from "../contact";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow-sm rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              Split<span className="text-amber-500">Bite</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-red-500 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-red-500 font-medium transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/create"
              className="text-white hover:text-red-500 font-medium transition-colors"
            >
              Create
            </Link>

            <div className="h-6 w-px bg-white/20 mx-2"></div>

            {/* 2. CONDITIONAL RENDERING */}
            {!isLoggedIn ? (
              /* SHOW LOGIN BUTTON IF NOT LOGGED IN */
              <button
                onClick={() => setIsLoggedIn(true)} // Mock login for testing
                className="flex ml-4 items-center gap-2 bg-red-700 cursor-pointer hover:bg-red-800 text-white px-5 py-2 rounded-full font-bold transition-all active:scale-95 shadow-lg"
              >
                <LogIn size={18} />
                Login
              </button>
            ) : (
              /* SHOW PROFILE DIV IF LOGGED IN */
              <div className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">
                    Alex Rossi
                  </p>
                  <p className="text-[11px] text-amber-400 font-medium">
                    Gold Member
                  </p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-gray-500 group-hover:border-red-500 transition-all">
                    <User size={20} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <ChevronDown
                  size={14}
                  className="text-white/70 group-hover:text-red-500"
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (simplified for brevity) */}
      {isOpen && (
        <div className="md:hidden bg-white p-4 space-y-4 rounded-b-2xl shadow-xl">
          {/* ... existing links ... */}
          {!isLoggedIn && (
            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
