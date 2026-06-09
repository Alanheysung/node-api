const pool = require('../config/database');

const list = async () => {
    const resultado = await pool.query('SELECT * FROM escolas ORDER BY id ASC');
    return resultado.rows;
};

const findById = async (id) => {
    const resultado = await pool.query('SELECT * FROM escolas WHERE id = $1', [id]);
    return resultado.rows[0];
};

const update = async (id, { nome, endereco }) => {
    if (!nome || !endereco) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Nome e endereço são campos obrigatórios'
        };
    }

    const resultado = await pool.query(
        'UPDATE escolas SET nome = $1, endereco = $2 WHERE id = $3 RETURNING *',
        [nome, endereco, id]
    );

    if (resultado.rows.length == 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Escola não encontrata'
        };
    }

    return {
        erro: false,
        status: 200,
        dados: resultado.rows[0]
    };
}

const create = async ({ nome, endereco }) => {
    if (!nome || !endereco) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Nome e endereço são campos obrigatórios.'
        };
    }

    const resultado = await pool.query(
        'INSERT INTO escolas (nome, endereco) VALUES ($1, $2) RETURNING *',
        [nome, endereco]
    );

    return {
        erro: false,
        status: 201,
        dados: resultado.rows[0]
    };
};

const remove = async (id) => {
    const resultado = await pool.query(
        'DELETE FROM escolas WHERE id = $1 RETURNING *',
        [id]
    );
    if (resultado.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Escola não encontrada'
        };
    };

    return {
        erro: false,
        status: 200,
        dados: resultado.rows[0]
    };
};

module.exports = {
    list,
    findById,
    update,
    create,
    remove
};