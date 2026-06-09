const movimentacoesService = require('../services/movimentacoes.service');

const create = async (req, res) => {
  try {
    const resultado = await movimentacoesService.create(req.body);

    if (resultado.erro) {
      return res.status(resultado.status).json({
        mensagem: resultado.mensagem,
        detalhe: resultado.detalhe
      });
    }

    return res.status(resultado.status).json({
      mensagem: 'Movimentação registrada com sucesso!',
      dados: resultado.dados
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro interno ao registrar movimentação.',
      erro: error.message
    });
  }
};

const listByEscola = async (req, res) => {
  try {
    const { escola_id } = req.params;
    const resultado = await movimentacoesService.listByEscola(escola_id);

    if (resultado.erro) {
      return res.status(resultado.status).json({
        mensagem: resultado.mensagem
      });
    }

    return res.status(resultado.status).json({
      mensagem: 'Histórico de movimentações listado com sucesso!',
      movimentacoes: resultado.dados
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao listar movimentações da escola.',
      erro: error.message
    });
  }
};

module.exports = {
  create,
  listByEscola
};