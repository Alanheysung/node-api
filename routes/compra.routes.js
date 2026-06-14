const { Router } = require('express');
const compraController = require('../controllers/compra.controller');
const { autenticar } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', autenticar, compraController.createCompra);
router.get('/', autenticar, compraController.listCompras);
router.get('/:id', autenticar, compraController.CompraById);

module.exports = router;