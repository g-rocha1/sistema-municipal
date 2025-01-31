const express = require('express');
const { criarUsuario, getAllUsers, updateUser, deleteUser, login, alterarSenha } = require('../controllers/userController');
const { authMiddleware, isAuthorized } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, isAuthorized('createUsers'), criarUsuario);
router.post('/login', login);
router.get('/', authMiddleware, isAuthorized('viewUsers'), getAllUsers);
router.put('/:id', authMiddleware, isAuthorized('editUsers'), updateUser);
router.delete('/:id', authMiddleware, isAuthorized('deleteUsers'), deleteUser);
router.put('/:id/senha', authMiddleware, alterarSenha);

module.exports = router;
