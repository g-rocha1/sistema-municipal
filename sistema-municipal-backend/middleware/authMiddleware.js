const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido', error: err.message });
  }
};

const isAuthorized = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];
    if (userPermissions.includes(permission) || ['master', 'prefeito', 'secretário'].includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Acesso negado' });
    }
  };
};

module.exports = { authMiddleware, isAuthorized };