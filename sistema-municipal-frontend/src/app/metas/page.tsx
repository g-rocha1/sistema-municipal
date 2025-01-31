// app/metas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import api from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Meta {
  id: number;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  deadline: string;
  secretary: string;
  tasks: {
    id: number;
    title: string;
    status: string;
  }[];
}

function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const response = await api.get("/goals");
        setMetas(response.data);
      } catch (error) {
        console.error("Erro ao buscar metas:", error);
      }
    };

    fetchMetas();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Metas</h1>
        <Button asChild>
          <Link href="/metas/create">Criar Nova Meta</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {metas.length > 0 ? (
          metas.map((meta) => (
            <Card key={meta.id}>
              <CardHeader>
                <CardTitle>{meta.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${meta.current_value}%` }}
                  ></div>
                </div>
                <p className="mt-2">{meta.current_value}% concluído</p>
                <div className="mt-4 space-x-2">
                  <Button asChild variant="outline">
                    <Link href={`/metas/${meta.id}`}>Detalhes</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/metas/${meta.id}/edit`}>Editar</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Nenhuma meta encontrada.</p>
        )}
      </div>
    </div>
  );
}

export default function ProtectedMetasPage() {
  return (
    <ProtectedRoute>
      <MetasPage />
    </ProtectedRoute>
  );
}