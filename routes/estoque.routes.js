const { Router } = require('express');
const estoqueController = require('../controllers/estoque.controller');


const router = Router();

router.get('/escola/:escola_id', estoqueController.listBYEscola);
router.get('/escola/:escola_id/baixo', estoqueController.listBaixoEstoqueByEscola);
router.put('/:id/minimo', estoqueController.updateEstoqueMinimo);

module.exports = router;
