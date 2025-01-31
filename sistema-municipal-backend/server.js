const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./config/database');
const userRoutes = require('./routes/userRoutes'); // Importe as rotas de Usuário
const goalRoutes = require('./routes/goalRoutes'); // Importe as rotas de metas

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

sequelize.sync({ alter: process.env.NODE_ENV !== 'production' })
  .then(() => {
    console.log('Modelos sincronizados com sucesso!');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar modelos ou iniciar o servidor:', err);
    process.exit(1);
  });

app.use('/api/users', userRoutes); // Use as rotas de Usuário
app.use('/api/goals', goalRoutes); // Use as rotas de metas