const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pendente", "em_andamento", "concluída", "atrasada", "cancelada"),
    defaultValue: "pendente",
  },
  responsible_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Pode ser nulo se não houver responsável
    references: {
      model: "Users", // Referência ao model de usuários
      key: "id",
    },
  },
  goal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Goals",
      key: "id",
    },
  },
}, {
  timestamps: true,
});

module.exports = Task;