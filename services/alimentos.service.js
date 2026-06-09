const pool = require('../config/database');

const list = async () => {
    const resultado = await pool.query('SELECT * FROM alimentos ORDER BY id ASC');
    return resultado.rows;
};

const findById = async (id) => {
    const resultado = await pool.query(' SELECT * FROM alimentos WHERE id = $1', [id]);
    return resultado.rows[0];
};

const update = async (id, { nome, unidade, categoria }) => {
    if (!nome || !unidade || !categoria) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Nome, unidade e categoria são campos obrigatórios'
        };
    }

    const resultado = await pool.query(
        'UPDATE alimentos SET nome = $1, unidade = $2, categoria = $3 WHERE id = $4 RETURNING *',
        [nome, unidade, categoria, id]
    );

    if (resultado.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Alimento não encontrado'
        };
    }

    return {
        erro: false,
        status: 200,
        dados: resultado.rows[0]
    };
}

const create = async ({ nome, categoria, unidade }) => {
    if (!nome || !categoria || !unidade) {
        return {
            erro: true,
            status: 400,
            mensagem: ' Todos os Campus são obrigatórios'
        };
    }

    const resultado = await pool.query(
        'INSERT INTO alimentos (nome, unidade, categoria) VALUES ($1, $2, $3) RETURNING *',
        [nome, unidade, categoria]
    );

    return {
        erro: false,
        status: 201,
        dados: resultado.rows[0]
    };
};

const remove = async (id) => {
    const resultado = await pool.query(
        'DELETE FROM alimentos WHERE id = $1 RETURNING *',
        [id]
    );
    if (resultado.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Alimento não encontrada'
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