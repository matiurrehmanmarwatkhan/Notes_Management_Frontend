import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      if (response.data && response.data.token) {
        toast.success(response.data.message || "Login successful!");
        login(response.data.token, response.data.user);
        navigate("/notes");
      } else {
        // Fallback in case token is returned differently
        login(response.data, null);
        navigate("/notes");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid email or password.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen max-w-7xl mx-auto px-6 w-full">
      <div className="glass-card animate-fade-in w-full max-w-md">
        <h2 className="text-center text-3xl font-bold mb-6">Welcome Back</h2>
        {error && <div className="text-danger text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-5 py-3 rounded-lg font-semibold transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:text-primary-hover transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
