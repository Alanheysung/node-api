const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const autenticar = async (req, res, next) => {
    try {
        // 1. Verifica se o token foi enviado
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ mensagem: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1];

        // 2. Valida o token JWT
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
        }

        // 3. Verifica se o usuário ainda existe no banco
        const resultado = await pool.query(
            'SELECT id, nome, email, tipo FROM usuarios WHERE id = $1',
            [payload.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado. Faça login novamente.' });
        }

        // 4. Adiciona o usuário na requisição
        req.usuario = resultado.rows[0];
        next();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao autenticar.' });
    }
};

module.exports = { autenticar };