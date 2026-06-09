const compraService = require('../services/compra.service');
const { list } = require('./usuarios.controller');

const createCompra = async (req, res) => {
    try {
        const resultado = await compraService.createCompra(req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem,
                detalhe: resultado.detalhe
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Compra cadastrada com sucesso!',
            compra: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar compra.',
            erro: error.message
        });
    }
};

const listCompras = async (req, res) => {
    try {
        const resultado = await compraService.listCompras(req.query);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem,
                detalhe: resultado.detalhe
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Compras listadas com sucesso!',
            compras: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar compras.',
            erro: error.message
        });
    }
};

const CompraById = async (req, res) => {
    try{
        const resultado = await compraService.CompraById(req.params.id);

        if(resultado.erro){
            return res.status(resultado.status).json({
                mensagem : resultado.mensagem,
                detalhe: resultado.detalhe
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Compra encontrda com sucesso!',
            compra: resultado.dados
        });
    }catch(error){
        return res.status(500).json({
            mesagem: 'Erro ao buscar compra',
            erro: error.message
        });
    }
};

module.exports = {
    createCompra,
    listCompras,
    CompraById
};