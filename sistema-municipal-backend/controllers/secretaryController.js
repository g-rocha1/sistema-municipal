const Secretary = require("../models/secretary");

// Listar todas as secretarias
const getSecretaries = async (req, res) => {
  try {
    const secretaries = await Secretary.findAll();
    res.json(secretaries);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar secretarias", error: error.message });
  }
};

module.exports = { getSecretaries };