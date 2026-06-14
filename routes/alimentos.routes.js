const { Router } = require('express');
const { autenticar } = require('../middleware/auth.middleware');




const alimentosController = require('../controllers/alimentos.controller');

const router = Router();

router.get('/', autenticar, alimentosController.list);
router.get('/:id', autenticar, alimentosController.findById);
router.post('/', autenticar, alimentosController.create);
router.put('/:id', autenticar, alimentosController.update);
router.delete('/:id', autenticar, alimentosController.remove);

module.exports = router;

