const { Router } = require('express');
const registroController = require('../controllers/registro_alunos.controller');

const router = Router();

router.get('/escola/:escola_id', registroController.listByEscola);
router.post('/', registroController.upsert);

module.exports = router;