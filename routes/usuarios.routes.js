const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const { autenticar } = require('../middleware/auth.middleware');



const router = Router();

router.get('/', autenticar, usuariosController.list);
router.get('/:id', autenticar, usuariosController.findById);
router.post('/', autenticar, usuariosController.create);
router.put('/:id', autenticar, usuariosController.update);
router.delete('/:id', autenticar, usuariosController.remove);

module.exports = router;