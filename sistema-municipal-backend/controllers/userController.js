const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role, permissions = [] } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
    }

    // Verificar se o usuário que está criando tem permissão
    if (!['master', 'prefeito', 'secretário'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Apenas usuários autorizados podem criar novos usuários.' });
    }

    const emailExistente = await User.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ message: 'Email já cadastrado!' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const usuario = await User.create({ nome, email, senha: hashedPassword, role, permissions });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role, permissions: usuario.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ usuario, token });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!['master', 'prefeito', 'secretário'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Apenas usuários autorizados podem visualizar todos os usuários.' });
    }

    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, role, permissions } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Garantir que o usuário Master não possa ser alterado por outros
    if (user.role === 'master' && req.user.role !== 'master') {
      return res.status(403).json({ message: 'Você não tem permissão para alterar este usuário.' });
    }

    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Garantir que o usuário Master não possa ser excluído por outros
    if (user.role === 'master') {
      return res.status(403).json({ message: 'O usuário Master não pode ser excluído.' });
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
  } 
};

const login = async (req, res) => {
  console.log("Body recebido no backend:", req.body);
  try {
    const { email, senha } = req.body;

    // Verifica se o email e a senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o campo de senha está presente
    if (!user.senha) {
      return res.status(500).json({ message: 'Senha ausente no banco de dados para este usuário.' });
    }

    // Compara a senha fornecida com o hash no banco
    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};


const alterarSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(senhaAtual, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    const hashedNovaSenha = await bcrypt.hash(novaSenha, 10);
    user.senha = hashedNovaSenha;

    await user.save();

    res.json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

module.exports = { criarUsuario, getAllUsers, updateUser, deleteUser, login, alterarSenha };