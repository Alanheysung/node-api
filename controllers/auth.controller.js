const authService = require('../services/auth.service');
const usuariosService = require('../services/usuarios.service');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const resultado = await authService.login(req.body);

    if (resultado.erro) {
      return res.status(resultado.status).json({
        mensagem: resultado.mensagem
      });
    }

    return res.status(resultado.status).json({
      mensagem: 'Login realizado com sucesso!',
      token:    resultado.dados.token,
      usuario:  resultado.dados.usuario,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao realizar login.',
      erro: error.message
    });
  }
};

const sistemaCofigurado = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id FROM usuarios LIMIT 1');
    return res.json({ configurado: resultado.rows.length > 0 });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao verificar sistema.' });
  }
};

const primeiroAcesso = async (req, res) => {
  try {
    console.log('BODY RECEBIDO:', req.body);

    const { nomeEscola, enderecoEscola, nomeAdmin, emailAdmin, senhaAdmin } = req.body;

    if (!nomeEscola || !nomeAdmin || !emailAdmin || !senhaAdmin) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se já existe algum usuário
    const jaExiste = await pool.query('SELECT id FROM usuarios LIMIT 1');
    if (jaExiste.rows.length > 0) {
      return res.status(403).json({ mensagem: 'Sistema já configurado.' });
    }

    // Cria a escola primeiro
    const escolaResult = await pool.query(
      `INSERT INTO escolas (nome, endereco) VALUES ($1, $2) RETURNING id`,
      [nomeEscola, enderecoEscola || null]
    );
    const escolaId = escolaResult.rows[0].id;

    // Cria o admin usando o service existente
    const resultado = await usuariosService.create({
      nome:      nomeAdmin,
      email:     emailAdmin,
      senha:     senhaAdmin,
      tipo:      'admin',
      escola_id: escolaId,
    });

    if (resultado.erro) {
      await pool.query('DELETE FROM escolas WHERE id = $1', [escolaId]);
      return res.status(resultado.status).json({ mensagem: resultado.mensagem });
    }

    return res.status(201).json({
      mensagem: 'Sistema configurado com sucesso!',
      escolaId,
      usuario: resultado.dados
    });

  } catch (error) {
    console.error('ERRO PRIMEIRO ACESSO:', error.message);
    return res.status(500).json({ mensagem: 'Erro ao configurar sistema.', erro: error.message });
  }
};

module.exports = { login, sistemaCofigurado, primeiroAcesso };