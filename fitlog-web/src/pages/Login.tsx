import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import logoImg from "../assets/logo.png";
import dashboardImg from "../assets/hometeste.png";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      signIn(data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-navy-900 text-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-[500px] flex flex-col">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={logoImg}
              alt="Logo FitLog"
              className="h-12 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Log In
          </h1>

          {error && (
            <span className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 p-3 rounded w-full text-center">
              {error}
            </span>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Email Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                className="bg-navy-800 border-navy-700 text-white placeholder-gray-500 focus:border-brand-orange"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-navy-800 border-navy-700 text-white placeholder-gray-500 focus:border-brand-orange"
              />
            </div>

            {/* Forgot Password */}
            <div className="mt-8 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-400 hover:text-brand-orange transition-colors"
              >
                ForgotPassword
              </Link>
            </div>

            {/* Button */}
            <Button type="submit" isLoading={loading}>
              Login
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              New to FitLog?{" "}
              <Link
                to="/register"
                className="text-brand-orange font-bold hover:underline ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0B1121] relative items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <img
          src={dashboardImg}
          alt="App Dashboard Preview"
          className="relative z-10 max-w-[85%] max-h-[85%] object-contain shadow-2xl rounded-xl border border-white/5"
        />
      </div>
    </div>
  );
};
