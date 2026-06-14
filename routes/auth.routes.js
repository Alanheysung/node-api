const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', authController.login);
router.get('/sistema-configurado', authController.sistemaCofigurado);
router.post('/primeiro-acesso', authController.primeiroAcesso);

module.exports = router;