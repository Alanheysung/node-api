const pool = require('../config/database');


const listBYEscola = async (escola_id) => {
    if (!escola_id) {
        return {
            erro: true,
            status: 400,
            mensagem: 'O id da escola é obrigatório.'
        };
    }

    const escolaResult = await pool.query(
        'SELECT id, nome FROM escolas WHERE id = $1',
        [escola_id]
    );

    if (escolaResult.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Escola não encontrada.'
        };
    }


    const resultado = await pool.query(
        `
    SELECT
      e.id,
      e.escola_id,
      esc.nome AS escola_nome,
      e.alimento_id,
      a.nome AS alimento_nome,
      a.categoria,
      a.unidade,
      e.quantidade,
      e.created_at,
      e.estoque_minimo
    FROM estoque e
    INNER JOIN escolas esc ON esc.id = e.escola_id
    INNER JOIN alimentos a ON a.id = e.alimento_id
    WHERE e.escola_id = $1
    ORDER BY a.nome ASC
    `,
        [escola_id]
    );

    return {
        erro: false,
        status: 200,
        dados: resultado.rows
    };
};

const listBaixoEstoqueByEscola = async (escola_id) => {
    if (!escola_id) {
        return {
            erro: true,
            status: 400,
            mensagem: 'O id da escola é obrigatório.'
        };
    }

    const escolaResult = await pool.query(
        'SELECt id, nome FROM escolas WHERE id = $1',
        [escola_id]
    );

    if (escolaResult.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Escola não encontrada.'
        };
    }

    const resultado = await pool.query(
        `
    SELECT
      e.id,
      e.escola_id,
      esc.nome AS escola_nome,
      e.alimento_id,
      a.nome AS alimento_nome,
      a.categoria,
      a.unidade,
      e.quantidade,
      e.estoque_minimo,
      e.created_at
    FROM estoque e
    INNER JOIN escolas esc ON esc.id = e.escola_id
    INNER JOIN alimentos a ON a.id = e.alimento_id
    WHERE e.escola_id = $1
      AND e.quantidade <= e.estoque_minimo
    ORDER BY e.quantidade ASC, a.nome ASC
    `,
        [escola_id]

    );

    return {
        erro: false,
        status: 200,
        dados: resultado.rows
    };
};

const updateEstoqueMinimo = async (id, estoque_minimo) => {
    if (!id) {
        return {
            erro: true,
            status: 400,
            mensagem: 'O id do estoque é obrigatório.'
        };
    }


    if (estoque_minimo === undefined || estoque_minimo === null) {
        return {
            erro: true,
            status: 400,
            mensagem: 'O estoque mínimo obrigatório.'
        };
    }

    if (Number(estoque_minimo) < 0) {
        return {
            erro: true,
            status: 400,
            mensagem: 'O estoque mínimo deve ser maior ou igual a zero.'
        };
    }

    const resultado = await pool.query(
        `
    UPDATE estoque
    SET estoque_minimo = $1
    WHERE id = $2
    RETURNING *
    `,
        [estoque_minimo, id]
    );

    if (resultado.rows.length === 0) {
        return {
            erro: true,
            status: 404,
            mensagem: 'Item de estoque não encontrado.'
        };
    }

    return {
        erro: false,
        status: 200,
        dados: resultado.rows[0]
    };
};

module.exports = {
    listBYEscola,
    listBaixoEstoqueByEscola,
    updateEstoqueMinimo
};