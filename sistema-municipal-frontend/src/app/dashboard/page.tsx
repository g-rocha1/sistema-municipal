// app/dashboard/page.tsx
"use client"; // Adicione isso para usar hooks no Next.js

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/utils/api";

interface KPI {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);

  useEffect(() => {
    // Busca os KPIs do backend
    const fetchKpis = async () => {
      try {
        const response = await api.get("/kpis"); // Endpoint do backend
        setKpis(response.data);
      } catch (error) {
        console.error("Erro ao buscar KPIs:", error);
      }
    };

    fetchKpis();
  }, []);

  return (
    // Adiciona o componente ProtectedRoute para proteger a página 
    <ProtectedRoute>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Geral</CardTitle>
            <CardDescription>Visão geral do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Total de Metas: 10</p>
            <p className="text-lg">Notificações: 3</p>
          </CardContent>
        </Card>

        {/* Card de KPIs */}
        <Card>
          <CardHeader>
            <CardTitle>KPIs</CardTitle>
            <CardDescription>Indicadores de desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            {kpis.map((kpi) => (
              <p key={kpi.name} className="text-lg">
                {kpi.name}: {kpi.value}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Card de Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Atalhos importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/metas">Ver Metas</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/notificacoes">Ver Notificações</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}

