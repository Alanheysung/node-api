const { Router } = require('express');
const escolasController = require('../controllers/escolas.controller');



const router = Router();

router.get('/', escolasController.list);
router.get('/:id', escolasController.findById);
router.post('/', escolasController.create);
router.put('/:id', escolasController.update);
router.delete('/:id', escolasController.remove);

module.exports = router;