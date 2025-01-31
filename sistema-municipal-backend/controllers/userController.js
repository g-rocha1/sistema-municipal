const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Joi = require('joi');
require('dotenv').config();

// Schema Joi atualizado e completo
const userSchema = Joi.object({
  nome: Joi.string().min(3).required().messages({
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 3 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'string.empty': 'O email é obrigatório'
  }),
  senha: Joi.string().min(8).required().messages({
    'string.min': 'A senha deve ter pelo menos 8 caracteres',
    'string.empty': 'A senha é obrigatória'
  }),
  role: Joi.string().valid('master', 'prefeito', 'secretario', 'employee').required().messages({
    'any.only': 'Função inválida',
    'any.required': 'A função é obrigatória'
  }),
  permissions: Joi.array().items(Joi.string()).default([])
});

// Middleware de autorização reutilizável
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso não autorizado' 
      });
    }
    next();
  };
};

const criarUsuario = async (req, res) => {
  try {
    // Validação com Joi
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ errors });
    }

    // Verificar permissão usando middleware
    if (!['master', 'prefeito', 'secretario'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Apenas usuários autorizados podem criar novos usuários.' 
      });
    }

    // Verificar email único
    const emailExistente = await User.findOne({ where: { email: value.email } });
    if (emailExistente) {
      return res.status(400).json({ 
        message: 'Email já cadastrado!' 
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(value.senha, 10);

    // Criar usuário
    const usuario = await User.create({
      nome: value.nome,
      email: value.email,
      senha: hashedPassword,
      role: value.role,
      permissions: value.permissions
    });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        role: usuario.role, 
        permissions: usuario.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        permissions: usuario.permissions
      }, 
      token 
    });

  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ 
      message: 'Erro interno no servidor',
      error: err.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Verificar permissão
    if (!['master', 'prefeito', 'secretario'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso não autorizado' 
      });
    }

    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'role', 'permissions', 'createdAt']
    });
    
    res.json(users);
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar usuários',
      error: error.message 
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ errors });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    // Proteger usuário Master
    if (user.role === 'master' && req.user.role !== 'master') {
      return res.status(403).json({ 
        message: 'Você não tem permissão para alterar este usuário.' 
      });
    }

    // Atualizar campos
    const updatedFields = {
      nome: value.nome,
      email: value.email,
      role: value.role,
      permissions: value.permissions
    };

    // Atualizar senha se fornecida
    if (value.senha) {
      updatedFields.senha = await bcrypt.hash(value.senha, 10);
    }

    await user.update(updatedFields);

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar usuário',
      error: error.message 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    if (user.role === 'master') {
      return res.status(403).json({ 
        message: 'O usuário Master não pode ser excluído.' 
      });
    }

    await user.destroy();
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir usuário',
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios.' 
      });
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        permissions: user.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      message: 'Erro interno no servidor',
      error: error.message 
    });
  }
};

const alterarSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    // Validação básica
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ 
        message: 'Senha atual e nova senha são obrigatórias' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    // Verificar senha atual
    const passwordMatch = await bcrypt.compare(senhaAtual, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ 
        message: 'Senha atual incorreta' 
      });
    }

    // Atualizar senha
    user.senha = await bcrypt.hash(novaSenha, 10);
    await user.save();

    res.json({ 
      message: 'Senha alterada com sucesso!' 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno no servidor',
      error: error.message 
    });
  }
};

module.exports = { 
  criarUsuario, 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  login, 
  alterarSenha 
};