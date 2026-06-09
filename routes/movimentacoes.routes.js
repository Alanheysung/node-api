const { Router } = require('express');
const movimentacoesController = require('../controllers/movimentacoes.controller');


const router = Router();

router.post('/', movimentacoesController.create);
router.get('/escola/:escola_id', movimentacoesController.listByEscola);


module.exports = router;