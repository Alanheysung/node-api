const { Router } = require('express');
const estoqueController = require('../controllers/estoque.controller');
const { autenticar } = require('../middleware/auth.middleware');


const router = Router();

router.get('/escola/:escola_id', autenticar, estoqueController.listBYEscola);
router.get('/escola/:escola_id/baixo', autenticar, estoqueController.listBaixoEstoqueByEscola);
router.put('/:id/minimo', autenticar, estoqueController.updateEstoqueMinimo);

module.exports = router;
