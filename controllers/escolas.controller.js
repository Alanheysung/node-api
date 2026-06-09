const escolasService = require('../services/escolas.service');



const list = async (req, res) => {
    try {
        const escolas = await escolasService.list();

        return res.status(200).json({
            mensagem: 'Lista de escolas',
            escolas
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao listar escolas",
            erro: error.message
        });
    }
};

const findById = async (req, res) => {
    const id = (req.params.id);

    const escola = await escolasService.findById(id);

    if (!escola) {
        return res.status(404).json({
            mensagem: 'Escola não encontrada'
        });
    }

    return res.status(200).json({
        mensagem: 'Escola encontrada com sucesso',
        escola
    });
};

const update = async (req, res) => {
    try {
        const id = (req.params.id);
        const resultado = await escolasService.update(id, req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: ' Escola Atualizada com sucesso',
            escola: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar escola.',
            erro: error.message
        });
    }
};

const create = async (req, res) => {
    try {
        const resultado = await escolasService.create(req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: "Escola cadastrada com sucesso",
            escola: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar escola,',
            erro: error.message
        });
    };
};

const remove = async (req, res) => {
    try{
        const id = req.params.id;
        const resultado = await escolasService.remove(id);

        if(resultado.erro){
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Escola removida com sucesso',
            escola: resultado.dados
        });
    }catch(error){
        return res.status(500).json({
            mensagem: 'Erro ao remover a escola.',
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
