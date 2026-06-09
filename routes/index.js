const { Router } = require('express');
const usuariosRoutes = require('./usuarios.routes');
const escolasRoutes = require('./escolas.routes');
const alimentosRoutes = require('./alimentos.routes');
const movimentacoesRoutes = require('./movimentacoes.routes');
const estoqueRoutes = require('./estoque.routes');
const compraRoutes = require('./compra.routes');
const relatorioRoutes = require('./relatorio.routes');
const registroAlunosRoutes = require('./registro_alunos.routes');
const authRoutes = require('./auth.routes');


const pool = require('../config/database');



const router = Router();

router.get('/teste', (req, res) => {
  res.json({ message: 'API do GestNutri funcionando!' });
});

router.get('/db-test', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW() AS data_hora');

    return res.status(200).json({
      mensagem: 'Consulta ao banco realizada com sucesso!',
      banco: resultado.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao consultar o banco de dados.',
      erro: error.message
    });
  }
});

router.use('/usuarios', usuariosRoutes);
router.use('/escolas', escolasRoutes);
router.use('/alimentos', alimentosRoutes);
router.use('/movimentacoes', movimentacoesRoutes);
router.use('/estoque', estoqueRoutes);
router.use('/compras', compraRoutes);
router.use('/relatorios', relatorioRoutes);
router.use('/alunos', registroAlunosRoutes);
router.use('/auth', authRoutes); 

module.exports = router;