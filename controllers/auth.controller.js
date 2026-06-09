const authService = require('../services/auth.service');

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

module.exports = { login };