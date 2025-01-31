"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  const [qrCode, setQrCode] = useState('');
  const handle2FASetup = async () => {
    const response = await api.post('/users/2fa/setup');
    setQrCode(response.data.qrCode);
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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Ativar 2FA</Button>
        </DialogTrigger>
        <DialogContent>
          {qrCode && <img src={qrCode} alt="QR Code 2FA" className="mx-auto" />}
          <Button onClick={handle2FASetup}>Gerar QR Code</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
