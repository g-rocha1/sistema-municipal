// app/metas/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "@/components/TiptapEditor";
import api from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Secretary {
  id: number;
  name: string;
}

interface Task {
  title: string;
  status: string;
  responsible_user_id?: number;
}

function CreateMetaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [secretary, setSecretary] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskResponsible, setNewTaskResponsible] = useState<number | null>(null);
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);

  useEffect(() => {
    const fetchSecretaries = async () => {
      try {
        const response = await api.get("/secretaries");
        setSecretaries(response.data);
      } catch (error) {
        console.error("Erro ao buscar secretarias:", error);
      }
    };

    fetchSecretaries();
  }, []);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          title: newTaskTitle,
          status: "pendente",
          responsible_user_id: newTaskResponsible || undefined,
        },
      ]);
      setNewTaskTitle("");
      setNewTaskResponsible(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/goals", {
        title,
        description,
        deadline,
        secretary,
        tasks,
      });
      router.push("/metas");
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Nova Meta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Descrição</Label>
          <TiptapEditor value={description} onChange={setDescription} />
        </div>
        <div>
          <Label>Prazo</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Secretaria</Label>
          <select
            value={secretary}
            onChange={(e) => setSecretary(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione uma secretaria</option>
            {secretaries.map((sec) => (
              <option key={sec.id} value={sec.name}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para adicionar tarefas */}
        <div>
          <Label>Tarefas</Label>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <p>{task.title}</p>
                <span className="text-sm text-gray-500">
                  (Responsável: {task.responsible_user_id ? "Usuário " + task.responsible_user_id : "Nenhum"})
                </span>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Adicionar tarefa"
              />
              <Button type="button" onClick={handleAddTask}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <Button type="submit">Criar Meta</Button>
      </form>
    </div>
  );
}

export default function ProtectedCreateMetaPage() {
  return (
    <ProtectedRoute>
      <CreateMetaPage />
    </ProtectedRoute>
  );
}