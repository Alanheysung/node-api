const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const list = async () => {
  const resultado = await pool.query('SELECT id, nome, tipo, email, created_at FROM usuarios ORDER BY id ASC');
  return resultado.rows;
};

const findById = async (id) => {
  const resultado = await pool.query('SELECT id, nome, tipo, created_at FROM usuarios WHERE id = $1', [id]);
  return resultado.rows[0];
};

const update = async (id, { nome, email, senha, tipo }) => {
  if (!nome || !email || !senha || !tipo) {
    return {
      erro: true,
      status: 400,
      mensagem: 'Nome, email, senha e tipo são obrigatórios.'
    };
  }

  const resultado = await pool.query(
    'UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo = $4 WHERE id = $5 RETURNING *',
    [nome, email, senha, tipo, id]
  );

  if (resultado.rows.length === 0) {
    return {
      erro: true,
      status: 404,
      mensagem: 'Usuário não encontrado.'
    };
  }

  return {
    erro: false,
    status: 200,
    dados: resultado.rows[0]
  };
};

const create = async ({ nome, email, senha, tipo, escola_id }) => {
  if (!nome || !email || !senha || !tipo || !escola_id) {
    return {
      erro: true,
      status: 400,
      mensagem: 'Todos os campos são obrigatórios.'
    };
  }

  // Criptografa a senha
  const hash = await bcrypt.hash(senha, 10);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Cria o usuário
    const usuarioResult = await client.query(
      `INSERT INTO usuarios (nome, email, senha, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo, created_at`,
      [nome, email, hash, tipo]
    );

    const usuario = usuarioResult.rows[0];

    // Vincula à escola automaticamente
    await client.query(
      `INSERT INTO usuario_escola (usuario_id, escola_id)
       VALUES ($1, $2)`,
      [usuario.id, escola_id]
    );

    await client.query('COMMIT');

    return {
      erro: false,
      status: 201,
      dados: usuario
    };

  } catch (error) {
    await client.query('ROLLBACK');
    return {
      erro: true,
      status: 500,
      mensagem: 'Erro ao cadastrar usuário.',
      detalhe: error.message
    };
  } finally {
    client.release();
  }
};

const remove = async (id) => {
  const resultado = await pool.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING *',
    [id]
  );

  if (resultado.rows.length === 0) {
    return {
      erro: true,
      status: 404,
      mensagem: 'Usuário não encontrado'
    };
  }

  return {
    erro0: false,
    status: 200,
    dados: resultado.rows[0]
  };
};

module.exports = {
  list,
  findById,
  create,
  update,
  remove
};