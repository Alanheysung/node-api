const { Router } = require('express');
const relatorioController = require('../controllers/relatorio.controller');
const { autenticar } = require('../middleware/auth.middleware');

const router = Router();

router.get('/mensal', autenticar, relatorioController.relatorioMensal);

module.exports = router;