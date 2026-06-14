const { Router } = require('express');
const escolasController = require('../controllers/escolas.controller');
const { autenticar } = require('../middleware/auth.middleware');



const router = Router();

router.get('/', autenticar, escolasController.list);
router.get('/:id', autenticar, escolasController.findById);
router.post('/', autenticar, escolasController.create);
router.put('/:id', autenticar, escolasController.update);
router.delete('/:id', autenticar, escolasController.remove);

module.exports = router;