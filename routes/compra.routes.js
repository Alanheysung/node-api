const { Router } = require('express');
const compraController = require('../controllers/compra.controller');

const router = Router();

router.post('/', compraController.createCompra);
router.get('/', compraController.listCompras);
router.get('/:id', compraController.CompraById);

module.exports = router;