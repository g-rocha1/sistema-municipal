// app/metas/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/TiptapEditor";
import api from "@/utils/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Task {
  id?: number;
  title: string;
  status: string;
}

function EditMetaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [secretary, setSecretary] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await api.get(`/goals/${id}`);
        const meta = response.data;
        setTitle(meta.title);
        setDescription(meta.description);
        setTargetValue(meta.target_value);
        setDeadline(meta.deadline);
        setSecretary(meta.secretary);
        setTasks(meta.tasks || []);
      } catch (error) {
        console.error("Erro ao buscar meta:", error);
      }
    };

    fetchMeta();
  }, [id]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { title: newTaskTitle, status: "pendente" }]);
      setNewTaskTitle("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/goals/${id}`, {
        title,
        description,
        target_value: targetValue,
        deadline,
        secretary,
        tasks,
      });
      router.push("/metas");
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Meta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Descrição</Label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <div>
            <Label>Valor Alvo</Label>
            <Input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              required
            />
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
            <Input value={secretary} onChange={(e) => setSecretary(e.target.value)} required />
          </div>
  
          {/* Campo para adicionar tarefas */}
          <div>
            <Label>Tarefas</Label>
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
            <div className="mt-2 space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-500">({task.status})</span>
                </div>
              ))}
            </div>
          </div>

        <Button type="submit">Salvar Alterações</Button>
      </form>
    </div>
  );
}

export default function ProtectedEditMetaPage() {
  return (
    <ProtectedRoute>
      <EditMetaPage />
    </ProtectedRoute>
  );
}