const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.PG_PORT, 10), // Conversão para inteiro
  logging: false, // Opcional: desabilita os logs do Sequelize
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao PostgreSQL com Sequelize!');
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL com Sequelize:', err.message);
    process.exit(1); // Encerra o processo se houver erro de conexão
  }
};

module.exports = { sequelize, connectDB };
