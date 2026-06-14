const authService = require('../services/auth.service');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const resultado = await authService.login(req.body);

    if (resultado.erro) {
      return res.status(resultado.status).json({
        mensagem: resultado.mensagem
      });
    }

    return res.status(resultado.status).json({
      mensagem: 'Login realizado com sucesso!',
      token:    resultado.dados.token,
      usuario:  resultado.dados.usuario,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao realizar login.',
      erro: error.message
    });
  }
};

const sistemaCofigurado = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id FROM escolas LIMIT 1');
    return res.json({ configurado: resultado.rows.length > 0 });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao verificar sistema.' });
  }
};

module.exports = { login, sistemaCofigurado };