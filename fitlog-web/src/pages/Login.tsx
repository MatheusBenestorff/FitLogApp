import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import logoImg from "../assets/logo.png";

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
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-6">
      <div className="w-full flex flex-col items-center max-w-[320px]">
        <img
          src={logoImg}
          alt="Logo FitLog"
          className="w-[296px] h-auto mb-8 object-contain"
        />

        {error && (
          <span className="text-red-500 text-sm mb-4 bg-red-100/10 p-2 rounded w-full text-center">
            {error}
          </span>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          {/* Email Input */}
          <div className="w-full max-w-[300px] mt-[18px]">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
            />
          </div>

          {/* Password Input */}
          <div className="w-full max-w-[300px] mt-[16px]">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </div>

          {/* Link "Não possui conta?" (TextView) */}
          <div className="w-full max-w-[300px] mt-[16px] flex justify-start">
            <Link
              to="/register"
              className="text-brand-orange text-sm hover:underline"
            >
              Não possui conta? Cadastre-se aqui!
            </Link>
          </div>

          {/* Button (LoginButton) */}
          <div className="w-full max-w-[300px] mt-[24px]">
            <Button type="submit" isLoading={loading}>
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
