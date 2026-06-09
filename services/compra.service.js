const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createCompra = async ({ escola_id, usuario_id, data, itens_compra}) => {
    if (!escola_id || !usuario_id || !data || !itens_compra) {
        return {
            erro: true,
            status: 400,
            mensagem: 'Todos os campos são obrigatórios.'
        };
    }

    if (!Array.isArray(itens_compra) || itens_compra.length === 0) {
        return {
            erro: true,
            status: 400,
            mensagem: 'A compra deve ter pelo menos um item.'
        };
    }

    for (const item of itens_compra) {
        if (!item.alimento_id || item.quantidade === undefined || item.valor_unitario === undefined) {
            return {
                erro: true,
                status: 400,
                mensagem: 'Cada item da compra deve ter alimemto_id, quantidade e valor_unitario.'
            };
        }

        if (Number(item.quantidade) <= 0) {
            return {
                erro: true,
                status: 400,
                mensagem: 'A quantidade de cada item deve ser maior que zero.'
            };
        }

        if (Number(item.valor_unitario) < 0) {
            return {
                erro: true,
                status: 400,
                mensagem: 'O valor unitário não pode ser negativo.'
            };
        }
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const escolaResult = await client.query(
            'SELECT id, nome FROM escolas WHERE id = $1',
            [escola_id]
        );

        if (escolaResult.rows.length == 0) {
            await client.query('ROLLBACK');
            return {
                erro: true,
                status: 404,
                mensagem: 'Escola não encontrada.'
            };
        }

        const usuario_result = await client.query(
            'SELECT id, nome FROM usuarios WHERE id = $1',
            [usuario_id]
        );

        if (usuario_result.rows.length === 0) {
            await client.query('ROLLBACK');
            return {
                erro: true,
                status: 404,
                mensagem: 'Usuário não encontrado.'
            };
        }

        const alimentosIds = itens_compra.map(item => item.alimento_id);

        const alimentoResul = await client.query(
            `
            SELECT id
            FROM alimentos
            WHERE id = ANY($1::uuid[])
            `,
            [alimentosIds]
        );

        if (alimentoResul.rows.length !== alimentosIds.length) {
            await client.query('ROLLBACK');
            return {
                erro: true,
                status: 404,
                mensagem: 'Um ou mais alimentos informados não existem.'
            };
        }

        const dataCompra = new Date(data);

        if (isNaN(dataCompra.getTime())) {
            await client.query('ROLLBACK');
            return {
                erro: true,
                status: 400,
                mensagem: 'Data da compra inválida.'
            };
        }

        const mes = dataCompra.getMonth() + 1;
        const ano = dataCompra.getFullYear();

        let controleFinanceiroId;
        let controleFinanceiroResult = await client.query(
            `
            SELECT id, escola_id, mes, ano, valor_recebido, valor_gasto
            FROM controle_financeiro
            WHERE escola_id = $1 AND mes = $2 AND ano = $3
            `,
            [escola_id, mes, ano]
        );

        if (controleFinanceiroResult.rows.length > 0) {
            controleFinanceiroId = controleFinanceiroResult.rows[0].id;
        } else {
            controleFinanceiroId = uuidv4();

            controleFinanceiroResult = await client.query(
                `
                INSERT INTO controle_financeiro (
                    id, escola_id, mes, ano, valor_recebido, valor_gasto
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                `,
                [controleFinanceiroId, escola_id, mes, ano, 27000.00, 0]
            );
        }
        let valorTotalCompra = 0;

        for (const item of itens_compra) {
            valorTotalCompra += Number(item.quantidade) * Number(item.valor_unitario);
        }

        const compraId = uuidv4();

        const compraResult = await client.query(
            `
            INSERT INTO compras (
                id, escola_id, controle_financeiro_id, usuario_id, data, valor_total
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [compraId, escola_id, controleFinanceiroId, usuario_id, data, valorTotalCompra]
        );

        const financeiroAtualizado = await client.query(
            `UPDATE controle_financeiro 
                SET valor_gasto = valor_gasto + $1
                WHERE id = $2
                RETURNING valor_gasto`,
            [valorTotalCompra, controleFinanceiroId]
        );

        console.log('Valor gasto atualizado:', financeiroAtualizado.rows[0].valor_gasto);

        for (const item of itens_compra) {
            const itemCompraId = uuidv4();
            const movimentacaoId = uuidv4();
            const quantidade = Number(item.quantidade);
            const valorUnitario = Number(item.valor_unitario);

            await client.query(
                `
                INSERT INTO itens_compra (
                    id, compra_id, alimento_id, quantidade, valor_unitario
                )
                VALUES ($1, $2, $3, $4, $5)
                `,
                [itemCompraId, compraId, item.alimento_id, quantidade, valorUnitario]
            );

            await client.query(
                `
                INSERT INTO estoque (
                    id, escola_id, alimento_id, quantidade
                )
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (escola_id, alimento_id)
                DO UPDATE SET quantidade = estoque.quantidade + EXCLUDED.quantidade
                `,
                [uuidv4(), escola_id, item.alimento_id, quantidade]
            );

            await client.query(
                `
                INSERT INTO movimentacoes (
                    id, tipo, escola_id, alimento_id, quantidade, data, usuario_id, compra_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `,
                [movimentacaoId, 'entrada', escola_id, item.alimento_id, quantidade, data, usuario_id, compraId]
            );
        }

        await client.query('COMMIT');

        return {
            erro: false,
            status: 201,
            dados: {
                id: compraResult.rows[0].id,
                escola_id: compraResult.rows[0].escola_id,
                controle_financeiro_id: compraResult.rows[0].controle_financeiro_id,
                usuario_id: compraResult.rows[0].usuario_id,
                data: compraResult.rows[0].data,
                valor_total: compraResult.rows[0].valor_total,
            }
        };

    } catch (error) {
        await client.query('ROLLBACK');
        return {
            erro: true,
            status: 500,
            mensagem: 'Erro ao cadastrar compra.',
            detalhe: error.message
        };
    } finally {
        client.release();
    }
};

const listCompras = async ({ escola_id, mes, ano }) => {
    try {
        let sql = `
            SELECT 
                c.id,
                c.data,
                c.valor_total,
                e.nome AS escola_nome,
                u.nome AS usuario_nome,
                cf.mes,
                cf.ano
            FROM compras c
            JOIN escolas e ON e.id = c.escola_id
            JOIN usuarios u ON u.id = c.usuario_id
            JOIN controle_financeiro cf ON cf.id = c.controle_financeiro_id
            WHERE 1=1
        `;

        const valores = [];

        if (escola_id) {
            valores.push(escola_id);
            sql += `AND c.escola_id = $${valores.length}`;
        }

        if (mes) {
            valores.push(Number(mes));
            sql += `AND cf.mes = $${valores.length}`;
        }

        if (ano) {
            valores.push(Number(ano));
            sql += ` AND cf.ano = $${valores.length}`;
        }

        sql += ` ORDER BY c.data DESC`;

        const result = await pool.query(sql, valores);

        return {
            erro: false,
            status: 200,
            dados: result.rows
        };
    } catch (error) {
        return {
            erro: true,
            status: 500,
            mensagem: 'Erro ao listar compras.',
            detalhe: error.message
        };
    }
};

const CompraById = async (compra_id) => {
    try{
        if(!compra_id){
            return {
                erro: true,
                status: 400,
                mensagem: 'ID da compra é obrigatório.'
            };
        }

        const result = await pool.query(
            `
            SELECT 
                c.id,
                c.data,
                c.valor_total,
                e.nome AS escola_nome,
                u.nome AS usuario_nome,
                cf.mes,
                cf.ano,
                cf.valor_recebido,
                cf.valor_gasto,
                ic.id AS item_id,
                ic.alimento_id,
                a.nome AS alimento_nome,
                ic.quantidade,
                ic.valor_unitario
            FROM compras c
            JOIN escolas e ON e.id = c.escola_id
            JOIN usuarios u ON u.id = c.usuario_id
            JOIN controle_financeiro cf ON cf.id = c.controle_financeiro_id
            LEFT JOIN itens_compra ic ON ic.compra_id = c.id
            LEFT JOIN alimentos a ON a.id = ic.alimento_id
            WHERE c.id = $1
            ORDER BY ic.id
            `,
            [compra_id]
        );

        if(result.rows.length === 0){
            return {
                erro: true,
                status: 404,
                mensagem: 'Compra não encontrda.'
            };
        }

        //Agrupar itens por compra
        const compra = {
             id: result.rows[0].id,
            data: result.rows[0].data,
            valor_total: result.rows[0].valor_total,
            escola_nome: result.rows[0].escola_nome,
            usuario_nome: result.rows[0].usuario_nome,
            mes: result.rows[0].mes,
            ano: result.rows[0].ano,
            valor_recebido: result.rows[0].valor_recebido,
            valor_gasto: result.rows[0].valor_gasto,
            itens: result.rows
                .filter(row => row.item_id) // Só itens válidos
                .map(item => ({
                    id: item.item_id,
                    alimento_id: item.alimento_id,
                    alimento_nome: item.alimento_nome,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                }))
        };

        return {
            erro: false,
            status: 200,
            dados: compra
        };
    }catch(error){
        return{
            erro: true,
            status: 500,
            mensagem: 'Erro ao buscar compra.',
            detalhe: error.message
        };
    }
};

module.exports = {
    createCompra,
    listCompras,
    CompraById
};

