const relatorioService = require('../services/relatorio.service');


const relatorioMensal = async (req, res) => {
    try {
        const resultado = await relatorioService.relatorioMensal(req.query);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem,
                detalhe: resultado.detalhe
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Relatório gerado com sucesso!',
            relatorio: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao gerar relatório.',
            erro: error.message
        });
    }
};

module.exports = {
    relatorioMensal
};