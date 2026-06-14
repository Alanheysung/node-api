const { Router } = require('express');
const movimentacoesController = require('../controllers/movimentacoes.controller');
const { autenticar } = require('../middleware/auth.middleware');


const router = Router();

router.post('/', autenticar, movimentacoesController.create);
router.get('/escola/:escola_id', autenticar, movimentacoesController.listByEscola);


module.exports = router;