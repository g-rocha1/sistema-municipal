"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("users/login", { email, senha });
      localStorage.setItem("authToken", response.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data?.message);
      alert(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
