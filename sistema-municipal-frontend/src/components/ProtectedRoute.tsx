"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    // Exibe um indicador de carregamento enquanto verifica o token
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
