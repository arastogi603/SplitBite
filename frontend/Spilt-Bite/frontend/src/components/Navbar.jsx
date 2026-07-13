import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = React.useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "Create", path: "/create" },
  ];

  return (
    <nav 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300 rounded-full ${
        isScrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-yellow-400/50 transition-colors">
              <img
                src="/logo.jpg"
                alt="SplitBite Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors duration-300"
            >
              Split<span className="text-yellow-400 group-hover:text-white transition-colors duration-300">Bite</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-yellow-400" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / Profile */}
          <div className="hidden md:flex items-center">
            <div className="h-5 w-px bg-white/10 mx-6"></div>

            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="group flex items-center gap-2 bg-white text-black hover:bg-yellow-400 px-5 py-2 rounded-full font-semibold transition-all duration-300 active:scale-95"
              >
                <LogIn size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>Log In</span>
              </button>
            ) : (
              <div 
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                title="Click to logout"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-white/50 group-hover:text-red-400 transition-colors">
                    <User size={18} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-400 border-2 border-black rounded-full"></span>
                </div>
                <div className="flex flex-col text-left mr-2">
                  <span className="text-sm font-semibold text-white leading-none">{user.email.split('@')[0]}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Logout</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full mt-2 transition-all duration-300 origin-top overflow-hidden glass rounded-3xl ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      >
        <div className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 pb-1 border-t border-white/10 mt-2">
            {!user ? (
              <button 
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-2xl font-bold mt-2"
              >
                <LogIn size={18} />
                Log In
              </button>
            ) : (
              <div 
                onClick={() => { logout(); navigate('/'); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mt-2 cursor-pointer hover:bg-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={20} className="text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.email.split('@')[0]}</div>
                  <div className="text-xs text-red-400">Logout</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
