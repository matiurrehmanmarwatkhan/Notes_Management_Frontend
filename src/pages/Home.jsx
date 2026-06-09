import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 w-full">
      <nav className="flex justify-between items-center py-5 border-b border-white/10 mb-10">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">NotesApp</div>
        <div className="flex gap-5 items-center">
          <Link to="/login" className="bg-transparent text-slate-100 border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300">Login</Link>
          <Link to="/signup" className="bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-5 py-2.5 rounded-lg font-semibold transition-all duration-300">Sign Up</Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="animate-fade-in text-5xl md:text-6xl mb-6 bg-gradient-to-r from-slate-50 to-slate-400 bg-clip-text text-transparent">
          Your Ideas, Organized.
        </h1>
        <p className="animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms] text-xl text-slate-400 max-w-2xl mb-10">
          A secure, beautiful, and intuitive place to capture your thoughts, manage tasks, and boost your productivity.
        </p>
        <div className="animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
          <Link to="/signup" className="bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-8 py-4 text-xl rounded-lg font-semibold transition-all duration-300">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
