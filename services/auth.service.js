const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async ({ email, senha }) => {
    if (!email || !senha) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Email e senha são obrigatórios.'
        };
    }

    // Busca o usuário pelo email
    const resultado = await pool.query(
        `SELECT 
      u.id,
      u.nome,
      u.email,
      u.senha,
      u.tipo,
      ue.escola_id
     FROM usuarios u
     LEFT JOIN usuario_escola ue ON ue.usuario_id = u.id
     WHERE u.email = $1
     LIMIT 1`,
        [email]
    );

    if (resultado.rows.length === 0) {
        return {
            erro: true,
            status: 401,
            mensagem: 'Email ou senha incorretos.'
        };
    }

    const usuario = resultado.rows[0];

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        return {
            erro: true,
            status: 401,
            mensagem: 'Email ou senha incorretos.'
        };
    }

    // Gera o JWT
    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            escolaId: usuario.escola_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        erro: false,
        status: 200,
        dados: {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                escolaId: usuario.escola_id,
            }
        }
    };

    const verificarSistemaConfigurado = async () => {
        const resultado = await pool.query('SELECT id FROM escolas LIMIT 1');
        return resultado.rows.length > 0;
    };

    module.exports = { login, verificarSistemaConfigurado };
};

module.exports = {
    login
};