const { Router } = require('express');




const alimentosController = require('../controllers/alimentos.controller');

const router = Router();

router.get('/', alimentosController.list);
router.get('/:id', alimentosController.findById);
router.post('/', alimentosController.create);
router.put('/:id', alimentosController.update);
router.delete('/:id', alimentosController.remove);

module.exports = router;

