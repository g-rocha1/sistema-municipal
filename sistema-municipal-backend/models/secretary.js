const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Secretary = sequelize.define("Secretary", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = Secretary;