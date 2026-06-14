const { Router } = require('express');
const registroController = require('../controllers/registro_alunos.controller');
const { autenticar } = require('../middleware/auth.middleware');

const router = Router();

router.get('/escola/:escola_id', autenticar, registroController.listByEscola);
router.post('/', autenticar, registroController.upsert);

module.exports = router;