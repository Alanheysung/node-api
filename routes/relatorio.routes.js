const { Router } = require('express');
const relatorioController = require('../controllers/relatorio.controller');

const router = Router();

router.get('/mensal', relatorioController.relatorioMensal);

module.exports = router;