import React, { useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "../assets/logo.png";

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    birthday: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender || undefined,
        birthday: formData.birthday || undefined,
      });

      alert("Conta criada com sucesso! Faça login para continuar.");
      navigate("/");
    } catch (err: any) {
      const message =
        err.response?.data || "Erro ao criar conta. Tente novamente.";
      setError(typeof message === "string" ? message : "Erro de validação");
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
          className="w-[150px] h-auto mb-6 object-contain"
        />

        <h2 className="text-white text-xl font-bold mb-6">Criar Conta</h2>

        {error && (
          <span className="text-red-500 text-sm mb-4 bg-red-100/10 p-2 rounded w-full text-center">
            {error}
          </span>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-4"
        >
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome Completo"
            required
          />

          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            required
          />

          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Senha"
            required
            minLength={6}
          />

          <Input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            placeholder="Data de Nascimento"
            style={{ colorScheme: "dark" }}
          />

          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: "Masculino", label: "Masculino" },
              { value: "Feminino", label: "Feminino" },
              { value: "Outro", label: "Outro" },
            ]}
          />

          <div className="w-full mt-4">
            <Button type="submit" isLoading={loading}>
              Cadastrar
            </Button>
          </div>

          <div className="mt-4">
            <Link to="/" className="text-brand-orange text-sm hover:underline">
              Já tem uma conta? Voltar para Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
