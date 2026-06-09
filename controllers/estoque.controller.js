const estoqueService = require('../services/estoque.service');


const listBYEscola = async (req, res) => {
    try {
        const { escola_id } = req.params;
        const resultado = await estoqueService.listBYEscola(escola_id);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Estoque listado com sucesso!',
            estoque: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar estoque da escola',
            erro: error.message
        });
    }

};

const listBaixoEstoqueByEscola = async (req, res) => {
    try {
        const { escola_id } = req.params;

        const resultado = await estoqueService.listBaixoEstoqueByEscola(escola_id);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Itens com baixo estoque listados com sucesso!',
            estoque: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar itens com baixo estoque.',
            erro: error.message
        });
    }
};

const updateEstoqueMinimo = async (req, res) => {
    try{
        const {id} = req.params;
        const {estoque_minimo} = req.body;

        const resultado = await estoqueService.updateEstoqueMinimo(id, estoque_minimo);

        if(resultado.erro){
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Estoque mínimo atualizado com sucesso!',
            estoque: resultado.dados
        });
    }catch(error){
        return res.status(500).json({
            mensagem: 'Erro ao atualizar estoque mínino.',
            erro: error.message
        });
    }
};

module.exports = {
    listBYEscola,
    listBaixoEstoqueByEscola,
    updateEstoqueMinimo
};