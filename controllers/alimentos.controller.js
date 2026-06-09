const alimentosService = require('../services/alimentos.service');



const list = async (req, res) => {
    try {
        const alimentos = await alimentosService.list();

        return res.status(200).json({
            mensagem: 'Lista de Alimentos',
            alimentos
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar alimentos',
            erro: error.message
        });

    }
};

const findById = async (req, res) => {
    const id = (req.params.id);

    const alimento = await alimentosService.findById(id);

    if (!alimento) {
        return res.status(404).json({
            mensagem: 'Alimento não encontrado'
        });
    }

    return res.status(200).json({
        mensagem: 'Alimento encontrado com sucesso',
        alimento
    });
};

const update = async (req, res) => {
    try {
        const id = (req.params.id);
        const resultado = await alimentosService.update(id, req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Alimento atualizado com sucesso!',
            alimento: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar alimento.',
            erro: error.message
        });
    }
};


const create = async (req, res) => {
    try{
    const resultado = await alimentosService.create(req.body);

    if (resultado.erro) {
        return res.status(resultado.status).json({
            mensagem: resultado.mensagem
        });
    }

    return res.status(resultado.status).json({
        mensagem: 'Aliemento cadastrado com sucesso.',
        alimento: resultado.dados
    })
    }catch (error){
        return res.status(500).json({
            mensagem: 'Erro o cadastrar alimento',
            erro: error.message
        });
    };
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await alimentosService.remove(id);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Alimento removido com sucesso',
            usuario: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao remover alimento',
            erro: error.message
        });
    }
};
module.exports = {
    list,
    findById,
    create, 
    update,
    remove
};
