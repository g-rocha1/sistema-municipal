// app/notificacoes/page.tsx
"use client"; // Adicione isso para usar hooks no Next.js

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

interface Notificacao {
  id: number;
  message: string;
  isRead: boolean;
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    // Busca as notificações do backend
    const fetchNotificacoes = async () => {
      try {
        const response = await api.get("/notifications"); // Endpoint do backend
        setNotificacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotificacoes();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/mark-as-read`); // Endpoint do backend
      setNotificacoes((prev) =>
        prev.map((notificacao) =>
          notificacao.id === id ? { ...notificacao, isRead: true } : notificacao
        )
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  return (
    <ProtectedRoute>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notificações</h1>

      <div className="space-y-4">
        {notificacoes.map((notificacao) => (
          <Card key={notificacao.id}>
            <CardHeader>
              <CardTitle>{notificacao.message}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant={notificacao.isRead ? "secondary" : "default"}
                onClick={() => handleMarkAsRead(notificacao.id)}
              >
                {notificacao.isRead ? "Lida" : "Marcar como Lida"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
}