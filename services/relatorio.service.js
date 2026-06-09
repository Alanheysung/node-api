const pool = require('../config/database');


const relatorioMensal = async ({ escola_id, mes, ano }) => {
    try {
        if (!escola_id || !mes || !ano) {
            return {
                erro: true,
                status: 400,
                mensagem: 'Escola, mês e ano são obrigatórios.'
            };
        }

        const resumoResult = await pool.query(
            `
            SELECT
            cf.id AS controle_financeiro_id,
            cf.escola_id,
            e.nome AS escola_nome,
            cf.mes,
            cf.ano,
            cf.valor_recebido,
            cf.valor_gasto,
            (cf.valor_recebido - cf.valor_gasto) AS saldo,
            COUNT(c.id) AS total_compras
            FROM controle_financeiro cf
            JOIN escolas e ON e.id = cf.escola_id
            LEFT JOIN compras c ON c.controle_financeiro_id = cf.id
            WHERE cf.escola_id = $1
            AND cf.mes = $2
            AND cf.ano = $3
            GROUP BY cf.id, e.nome
            `,
            [escola_id, Number(mes), Number(ano)]
        );

        if (resumoResult.rows.length === 0) {
            return {
                erro: true,
                status: 404,
                mensagem: 'Controle financeiro não encontrado para o período informado.'
            };
        }

        const resumo = resumoResult.rows[0];

        const comprasResult = await pool.query(
            `
            SELECT
            c.id,
            c.data,
            c.valor_total
            FROM compras c
            WHERE c.escola_id = $1
            AND EXTRACT(MONTH FROM c.data) = $2
            AND EXTRACT(YEAR FROM c.data) = $3
            ORDER BY c.data ASC
            `,
            [escola_id, Number(mes), Number(ano)]
        );

        return {
            erro: false,
            status: 200,
            dados: {
                escola_id: resumo.escola_id,
                escola_nome: resumo.escola_nome,
                mes: Number(resumo.mes),
                ano: Number(resumo.ano),
                valor_recebido: Number(resumo.valor_recebido),
                valor_gasto: Number(resumo.valor_gasto),
                saldo: Number(resumo.saldo),
                total_compras: Number(resumo.total_compras),
                compras: comprasResult.rows
            }
        };
    } catch (error) {
        return {
            erro: true,
            status: 500,
            mensagem: 'Erro ao gerar relatório mensal.',
            detalhe: error.message
        };
    }
};

module.exports = {
    relatorioMensal
};
