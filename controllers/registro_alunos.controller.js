const registroService = require('../services/registro_alunos.service.js');

const listByEscola = async (req, res) => {
  try {
    const { escola_id } = req.params;
    const registros = await registroService.listByEscola(escola_id);

    return res.status(200).json({
      mensagem: 'Registros listados com sucesso!',
      registros
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao listar registros de alunos.',
      erro: error.message
    });
  }
};

const upsert = async (req, res) => {
  try {
    const resultado = await registroService.upsert(req.body);

    if (resultado.erro) {
      return res.status(resultado.status).json({
        mensagem: resultado.mensagem
      });
    }

    return res.status(resultado.status).json({
      mensagem: 'Registro salvo com sucesso!',
      registro: resultado.dados
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao salvar registro de alunos.',
      erro: error.message
    });
  }
};

module.exports = { listByEscola, upsert };