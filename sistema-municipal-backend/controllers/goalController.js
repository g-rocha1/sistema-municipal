const Goal = require("../models/goal");
const Task = require("../models/task");

// Criar uma nova meta com tarefas
const createGoal = async (req, res) => {
  try {
    const { title, description, deadline, secretary, tasks } = req.body;
    const created_by = req.user.id;

    // Cria a meta
    const goal = await Goal.create({ title, description, deadline, secretary, created_by });

    // Cria as tarefas associadas à meta
    if (tasks && tasks.length > 0) {
      await Promise.all(
        tasks.map((task) =>
          Task.create({
            title: task.title,
            status: task.status,
            responsible_user_id: task.responsible_user_id,
            goal_id: goal.id,
          })
        )
      );
    }

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar meta", error: error.message });
  }
};

// Listar metas (filtradas por secretaria, se necessário)
const getGoals = async (req, res) => {
  try {
    const { role, secretary } = req.user;
    let whereClause = {};

    if (role === "secretário") {
      whereClause = { secretary };
    }

    const goals = await Goal.findAll({
      where: whereClause,
      include: [{ model: Task, as: "tasks" }],
    });

    // Calcula o progresso de cada meta
    const goalsWithProgress = goals.map((goal) => {
      const totalTasks = goal.tasks.length;
      const completedTasks = goal.tasks.filter((task) => task.status === "concluída").length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        ...goal.toJSON(),
        progress,
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar metas", error: error.message });
  }
};

// Buscar uma meta pelo ID
const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByPk(id, {
      include: [{ model: Task, as: "tasks" }],
    });

    if (!goal) {
      return res.status(404).json({ message: "Meta não encontrada" });
    }

    // Calcula o progresso da meta
    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter((task) => task.status === "concluída").length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({ ...goal.toJSON(), progress });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar meta", error: error.message });
  }
};

// Atualizar uma meta e suas tarefas
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, secretary, tasks } = req.body;

    const goal = await Goal.findByPk(id);
    if (!goal) {
      return res.status(404).json({ message: "Meta não encontrada" });
    }

    // Atualiza os campos da meta
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (deadline) goal.deadline = deadline;
    if (secretary) goal.secretary = secretary;

    await goal.save();

    // Atualiza as tarefas
    if (tasks && tasks.length > 0) {
      await Task.destroy({ where: { goal_id: goal.id } }); // Remove tarefas antigas
      await Promise.all(
        tasks.map((task) =>
          Task.create({
            title: task.title,
            status: task.status,
            responsible_user_id: task.responsible_user_id,
            goal_id: goal.id,
          })
        )
      );
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar meta", error: error.message });
  }
};

// Excluir uma meta
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByPk(id);
    if (!goal) {
      return res.status(404).json({ message: "Meta não encontrada" });
    }

    await goal.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir meta", error: error.message });
  }
};

const getGoalsStats = async (req, res) => {
  try {
    const goals = await Goal.findAll();
    const stats = goals.map(goal => ({
      name: goal.title,
      progress: goal.progressPercentage,
    }));
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
};

module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, getGoalsStats };