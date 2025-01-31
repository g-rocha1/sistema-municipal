const express = require('express');
const { criarUsuario, getAllUsers, updateUser, deleteUser, login, alterarSenha } = require('../controllers/userController');
const { authMiddleware, isAuthorized } = require('../middleware/authMiddleware');
const logAction = require('../middleware/auditMiddleware');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const router = express.Router();

router.post('/', authMiddleware, logAction('CREATE_USER', 'User'), isAuthorized('createUsers'), criarUsuario);
router.post('/login', login);
router.get('/', authMiddleware, isAuthorized('viewUsers'), getAllUsers);
router.put('/:id', authMiddleware, isAuthorized('editUsers'), updateUser);
router.delete('/:id', authMiddleware, isAuthorized('deleteUsers'), deleteUser);
router.put('/:id/senha', authMiddleware, alterarSenha);

// Rota para gerar o QR Code
router.post('/2fa/setup', authMiddleware, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      const secret = speakeasy.generateSecret({ name: "Prefeitura Municipal" });
      
      user.twoFASecret = secret.base32;
      await user.save();
  
      QRCode.toDataURL(secret.otpauth_url, (err, qrCode) => {
        res.status(200).json({ qrCode, secret: secret.base32 });
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao configurar 2FA" });
    }
  });
  
  // Rota para validar o token
  router.post('/2fa/verify', authMiddleware, async (req, res) => {
    const { token } = req.body;
    const user = await User.findByPk(req.user.id);
  
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: token,
      window: 1
    });
  
    if (verified) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Token inválido" });
    }
  });

module.exports = router;
