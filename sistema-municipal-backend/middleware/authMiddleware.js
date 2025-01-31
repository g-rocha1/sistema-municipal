// sistema-municipal-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findByPk(decoded.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    req.user = usuario;
    next();
    
  } catch (error) {
    console.error('[ERRO] Autenticação:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};