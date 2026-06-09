const pool = require('../config/database');


const create = async ({
  tipo,
  escola_id,
  alimento_id,
  quantidade,
  usuario_id,
  compra_id = null
}) => {
  if (!tipo || !escola_id || !alimento_id || !quantidade || !usuario_id) {
    return {
      erro: true,
      status: 400,
      mensagem: 'Tipo, escola, alimento, quantidade e usuário são obrigatórios.'
    };

  }

  if (!['entrada', 'saida'].includes(tipo)) {
    return {
      erro: true,
      status: 400,
      mensagem: 'O tipo deve ser entrada ou saída.'
    };
  }

  if (Number(quantidade) <= 0) {
    return {
      erro: true,
      status: 400,
      mensagem: 'A quantidade deve ser maior que zero.'
    };
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const estoqueResult = await client.query(
      'SELECT * FROM estoque WHERE escola_id = $1 AND alimento_id = $2 FOR UPDATE',
      [escola_id, alimento_id]
    );

    let estoqueAtualizado;

    if (tipo === 'entrada') {
      if (estoqueResult.rows.length > 0) {
        estoqueAtualizado = await client.query(
          'UPDATE estoque SET quantidade = quantidade + $1 WHERE escola_id = $2 AND alimento_id = $3 RETURNING *',
          [quantidade, escola_id, alimento_id]
        );
      } else {
        estoqueAtualizado = await client.query(
          'INSERT INTO estoque (escola_id, alimento_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
          [escola_id, alimento_id, quantidade]
        );
      }
    }

    if (tipo === 'saida') {
      if (estoqueResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          erro: true,
          status: 404,
          mensagem: 'Item não encontrado no estoque desta escola'
        };
      }

      const estoqueAtual = estoqueResult.rows[0];

      if (Number(estoqueAtual.quantidade) < Number(quantidade)) {
        await client.query('ROLLBACK');
        return {
          erro: true,
          status: 400,
          mensagem: 'Saldo insuficiente para realizar a saída.'
        };
      }

      estoqueAtualizado = await client.query(
        `
        UPDATE estoque
        SET quantidade = quantidade - $1
        WHERE escola_id = $2 AND alimento_id = $3
        RETURNING *
        `,
        [quantidade, escola_id, alimento_id]
      );
    }

    const movimentacaoResult = await client.query(
      `
      INSERT INTO movimentacoes
      (tipo, escola_id, alimento_id, quantidade, usuario_id, compra_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [tipo, escola_id, alimento_id, quantidade, usuario_id, compra_id]
    );

    await client.query('COMMIT');

    return {
      erro: false,
      status: 201,
      dados: {
        movimentacao: movimentacaoResult.rows[0],
        estoque: estoqueAtualizado.rows[0]
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');

    return {
      erro: true,
      status: 500,
      mensagem: 'Erro ao registrar movimentação.',
      detalhe: error.message
    };
  } finally {
    client.release();
  }
};

const listByEscola = async (escola_id) => {
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
      m.id,
      m.tipo,
      m.escola_id,
      e.nome AS escola_nome,
      m.alimento_id,
      a.nome AS alimento_nome,
      a.categoria,
      a.unidade,
      m.quantidade,
      m.data,
      m.usuario_id,
      u.nome AS usuario_nome,
      m.compra_id,
      m.created_at
    FROM movimentacoes m
    INNER JOIN escolas e ON e.id = m.escola_id
    INNER JOIN alimentos a ON a.id = m.alimento_id
    INNER JOIN usuarios u ON u.id = m.usuario_id
    WHERE m.escola_id = $1
    ORDER BY m.data DESC, m.created_at DESC
    `,
    [escola_id]
  );

  return {
    erro: false,
    status: 200,
    dados: resultado.rows
  };
};

module.exports = {
  create,
  listByEscola
};