const usuariosService = require('../services/usuarios.service');



const list = async (req, res) => {
    try {
        const usuarios = await usuariosService.list();

        return res.status(200).json({
            mensagem: 'Lista de usuários',
            usuarios
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar usuários',
            erro: error.message
        });
    }
};

const findById = async (req, res) => {
    const id = (req.params.id);

    const usuario = await usuariosService.findById(id);

    if (!usuario) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado.'
        });
    }

    return res.status(200).json({
        mensagem: 'Usuário encontrado com sucesso!',
        usuario
    });
};

const update = async (req, res) => {
    try {
        const id = (req.params.id);
        const resultado = await usuariosService.update(id, req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao atualizar usuário.',
            erro: error.message
        });
    }
};

const create = async (req, res) => {
    try {
        const resultado = await usuariosService.create(req.body);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.',
            erro: error.message
        });
    };
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await usuariosService.remove(id);

        if (resultado.erro) {
            return res.status(resultado.status).json({
                mensagem: resultado.mensagem
            });
        }

        return res.status(resultado.status).json({
            mensagem: 'Usuário removido com sucesso',
            usuario: resultado.dados
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao remover usuário',
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