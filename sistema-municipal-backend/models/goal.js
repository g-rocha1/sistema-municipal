const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Goal = sequelize.define("Goal", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  target_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  current_value: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  secretary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
}, {
  timestamps: true,
});

module.exports = Goal;