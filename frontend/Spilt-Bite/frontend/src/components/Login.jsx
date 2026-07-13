import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://splitbite-backend.onrender.com/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // In a real app, send the token to the backend to be verified.
      // For this hackathon, we decode it locally and send the email/name to the backend OAuth endpoint.
      const decoded = (await import('jwt-decode')).jwtDecode(credentialResponse.credential);
      const res = await axios.post('https://splitbite-backend.onrender.com/api/auth/oauth/google', {
        email: decoded.email,
        name: decoded.name
      });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError('Google Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-background)] font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-yellow-400/10 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-900/10 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="glass p-10 rounded-3xl w-full max-w-md z-10 text-white shadow-2xl border border-white/10 backdrop-blur-xl bg-black/40">
        <Link to="/" className="inline-flex items-center text-sm text-white/50 hover:text-white mb-6 transition-colors">
          <span className="mr-2">←</span> Back to Main Menu
        </Link>
        <h2 className="text-4xl font-bold mb-6 text-center tracking-tight">Welcome Back</h2>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="w-full h-px bg-white/10"></span>
          <span className="px-4 text-sm text-white/50 uppercase tracking-widest">or</span>
          <span className="w-full h-px bg-white/10"></span>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login failed.')}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          Don't have an account? <Link to="/register" className="text-yellow-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
