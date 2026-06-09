const pool = require('../config/database');

const listByEscola = async (escola_id) => {
    const resultado = await pool.query(
        `SELECT 
      id,
      escola_id,
      mes,
      ano,
      quantidade_alunos,
      created_at
     FROM registro_alunos
     WHERE escola_id = $1
     ORDER BY ano DESC, mes DESC`,
        [escola_id]
    );
    return resultado.rows;
};

const upsert = async ({ escola_id, mes, ano, quantidade_alunos }) => {
    if (!escola_id || !mes || !ano || quantidade_alunos === undefined) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Todos os campos são obrigatórios.'
        };
    }

    if (mes < 1 || mes > 12) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Mês inválido.'
        };
    }

    if (quantidade_alunos < 0) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Quantidade de alunos não pode ser negativa.'
        };
    }

    const resultado = await pool.query(
        `INSERT INTO registro_alunos (escola_id, mes, ano, quantidade_alunos)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (escola_id, mes, ano)
     DO UPDATE SET quantidade_alunos = EXCLUDED.quantidade_alunos
     RETURNING *`,
        [escola_id, mes, ano, quantidade_alunos]
    );

    return {
        erro: false,
        status: 201,
        dados: resultado.rows[0]
    };
};

module.exports = {
    listByEscola,
    upsert
};