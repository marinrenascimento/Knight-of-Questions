import { Avaliacao, Pergunta } from '../models/index.js';
import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';
// ... resto dos imports
// Assumindo a criação dos models AvaliacaoReview e RespostaUsuario no futuro

export const getAvaliacaoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        // Ajuste o alias 'perguntas' se não estiver definido no seu index.js
        const avaliacao = await Avaliacao.findByPk(id);
        const perguntas = await Pergunta.findAll({ where: { id_avaliacao: id } });
        
        if (!avaliacao) return res.status(404).json({ message: 'Avaliação não encontrada' });
        
        res.json({ ...avaliacao.toJSON(), perguntas });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar avaliação', error: err.message });
    }
};

export const getAllAvaliacoesByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const avaliacoes = await Avaliacao.findAll({ where: { id_user: userId } });
        res.json(avaliacoes);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar avaliações', error: err.message });
    }
};

export const getAllAvaliacoesVestibulares = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.findAll({ where: { is_vestibular: true } });
        res.json(avaliacoes);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar avaliações', error: err.message });
    }
};

export const createAvaliacao = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { titulo, is_vestibular, id_user, disciplina_id, quantidade_perguntas } = req.body;

        if (!titulo) {
            return res.status(400).json({ message: "O título da avaliação é obrigatório." });
        }

        const novaAvaliacao = await Avaliacao.create(
            { titulo, is_vestibular, id_user },
            { transaction }
        );

        const avaliacaoId = novaAvaliacao.id;
        let perguntasAdicionadas = 0;
        
        // NOVO: Array para guardar as perguntas que o sistema vai clonar
        const perguntasClonadas = []; 

        if (disciplina_id && quantidade_perguntas > 0) {
            
            const [perguntasSorteadas] = await sequelize.query(
                `SELECT id, enunciado, nivel_dificuldade, conteudo_id 
                 FROM pergunta 
                 WHERE disciplina_id = :disciplina_id
                 ORDER BY RANDOM() 
                 LIMIT :quantidade`,
                {
                    replacements: { 
                        disciplina_id: parseInt(disciplina_id, 10), 
                        quantidade: parseInt(quantidade_perguntas, 10) 
                    },
                    transaction
                }
            );

            const perguntas = Array.isArray(perguntasSorteadas) ? perguntasSorteadas : [];
            perguntasAdicionadas = perguntas.length;

            for (const originalPergunta of perguntas) {
                
                const insertPergunta = await sequelize.query(
                    `INSERT INTO pergunta (enunciado, nivel_dificuldade, disciplina_id, id_avaliacao, conteudo_id)
                     VALUES (:enunciado, :nivel_dificuldade, :disciplina_id, :id_avaliacao, :conteudo_id)
                     RETURNING id`,
                    {
                        replacements: {
                            enunciado: originalPergunta.enunciado,
                            nivel_dificuldade: originalPergunta.nivel_dificuldade || 1,
                            disciplina_id: parseInt(disciplina_id, 10),
                            id_avaliacao: avaliacaoId, 
                            conteudo_id: originalPergunta.conteudo_id || null
                        },
                        transaction
                    }
                );

                const arrPergunta = [insertPergunta].flat(Infinity);
                const objPergunta = arrPergunta.find(item => item && item.id !== undefined);
                const novoPerguntaId = objPergunta.id;

                // NOVO: Adiciona a pergunta clonada ao nosso array de retorno
                perguntasClonadas.push({
                    id: novoPerguntaId,
                    enunciado: originalPergunta.enunciado,
                    nivel_dificuldade: originalPergunta.nivel_dificuldade,
                    disciplina_id: parseInt(disciplina_id, 10),
                    conteudo_id: originalPergunta.conteudo_id
                });

                await sequelize.query(
                    `INSERT INTO alternativa (texto, is_correta, id_pergunta, descricao)
                     SELECT texto, is_correta, :novaPerguntaId, descricao
                     FROM alternativa
                     WHERE id_pergunta = :perguntaOriginalId`,
                    {
                        replacements: {
                            novaPerguntaId: novoPerguntaId,
                            perguntaOriginalId: originalPergunta.id
                        },
                        transaction
                    }
                );
            }
        }

        await transaction.commit();

        res.status(201).json({
            message: "Avaliação criada com sucesso!",
            avaliacao: novaAvaliacao,
            resumo: {
                disciplina_solicitada: disciplina_id || "Nenhuma",
                quantidade_solicitada: quantidade_perguntas || 0,
                perguntas_efetivamente_clonadas: perguntasAdicionadas
            },
            // NOVO: Retorna a lista exata das questões criadas para o front-end
            questoes_adicionadas: perguntasClonadas 
        });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao criar avaliação', error: err.message });
    }
};

export const updateInfoDeck = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { titulo, is_vestibular } = req.body;

        const avaliacao = await Avaliacao.findByPk(id);
        if (!avaliacao) return res.status(404).json({ message: 'Avaliação não encontrada' });

        await avaliacao.update({ titulo, is_vestibular });
        res.json(avaliacao);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar avaliação', error: err.message });
    }
};

export const deleteDeckAndFlashcards = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const id = parseInt(req.params.id, 10);
        
        const avaliacao = await Avaliacao.findByPk(id, { transaction });
        if (!avaliacao) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        // 1. Encontra os IDs das perguntas
        const perguntas = await Pergunta.findAll({
            where: { id_avaliacao: id },
            attributes: ['id'],
            transaction
        });

        const perguntaIds = perguntas.map(p => p.id);

        if (perguntaIds.length > 0) {
            // 2. NOVO: Apaga o histórico de respostas dos usuários vinculadas a essas perguntas
            await sequelize.query(
                `DELETE FROM resposta_usuario WHERE id_pergunta IN (:perguntaIds)`,
                { 
                    replacements: { perguntaIds },
                    transaction 
                }
            );

            // 3. Apaga as alternativas
            await sequelize.query(
                `DELETE FROM alternativa WHERE id_pergunta IN (:perguntaIds)`,
                { 
                    replacements: { perguntaIds },
                    transaction 
                }
            );
        }

        // 4. Se existir tabela de sessão de avaliação (avaliacao_review), precisamos limpá-la também
        // Envolvemos num try/catch simples apenas para essa query, caso o nome da coluna id_avaliacao seja outro
        try {
            await sequelize.query(
                `DELETE FROM avaliacao_review WHERE id_avaliacao = :id`,
                { replacements: { id }, transaction }
            );
        } catch (e) {
            // Se falhar aqui (ex: a coluna tiver outro nome), deixamos passar silenciosamente
            // pois o banco vai nos avisar no próximo passo se for realmente um problema
        }

        // 5. Deleta as perguntas via Model
        await Pergunta.destroy({ 
            where: { id_avaliacao: id },
            transaction
        });
        
        // 6. Deleta a avaliação via Model
        await avaliacao.destroy({ transaction });

        await transaction.commit();

        res.json({ message: 'Avaliação, histórico, perguntas e alternativas removidas com sucesso' });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao deletar', error: err.message });
    }
};

export const savePeriodoReview = async (req, res) => {
    // Lógica para espaçamento de revisão (requer tabela específica para registrar isso)
    res.json({ message: 'Aviso: Implementar tabela de agendamento de revisões.' });
};

export const startAvaliacao = async (req, res) => {
    try {
        const { id_avaliacao, id_user } = req.body;
        // mock para AvaliacaoReview
        res.status(201).json({ message: "Sessão iniciada", id_avaliacao, id_user, iniciado_em: new Date() });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao iniciar avaliação', error: err.message });
    }
};

export const finishAvaliacao = async (req, res) => {
    try {
        const { id_avaliacao_review } = req.body;

        if (!id_avaliacao_review) {
            return res.status(400).json({ message: 'ID da avaliação review não fornecido' });
        }

        // 1. Busca as respostas com o status da alternativa direto do banco
        // Sem funções agregadoras, apenas os dados brutos e puros
        const [respostas] = await sequelize.query(
            `SELECT 
                r.id, 
                a.is_correta 
             FROM resposta_usuario r
             LEFT JOIN alternativa a ON r.id_alternativa = a.id
             WHERE r.id_avaliacao_review = :reviewId`,
            { 
                replacements: { reviewId: parseInt(id_avaliacao_review, 10) } 
            }
        );

        // 2. Faz o cálculo usando JavaScript puro (Zero chance de erro de conversão)
        const totalRespondidas = respostas.length;
        
        // Filtra os acertos garantindo que entende true (booleano), 'true' (string) ou 1 (inteiro)
        const acertos = respostas.filter(r => 
            r.is_correta === true || 
            r.is_correta === 'true' || 
            r.is_correta === 1
        ).length;

        // Calcula a nota de 0 a 100
        const notaFinal = totalRespondidas > 0 ? (acertos / totalRespondidas) * 100 : 0;
        const terminado_em = new Date();

        // 3. Atualiza os dados no banco
        await sequelize.query(
            `UPDATE avaliacao_review 
             SET terminado_em = :terminado_em, 
                 qtd_questoes_respondidas = :qtd_questoes
             WHERE id = :reviewId`,
            {
                replacements: {
                    reviewId: parseInt(id_avaliacao_review, 10),
                    terminado_em: terminado_em,
                    qtd_questoes: totalRespondidas
                }
            }
        );

        // 4. Retorna a resposta finalizada
        res.json({
            message: "Sessão finalizada com sucesso",
            id_avaliacao_review,
            terminado_em,
            qtd_questoes_respondidas: totalRespondidas,
            acertos,
            notaFinal: Math.round(notaFinal)
        });

    } catch (err) {
        res.status(500).json({ message: 'Erro ao finalizar avaliação', error: err.message });
    }
};

export const getResultadoAvaliacao = async (req, res) => {
    console.log("CHEGOU NA ROTA! ID:", req.params.reviewId);
    try {
        const id_avaliacao_review = parseInt(req.params.reviewId, 10);
        
        // Note que tirei os colchetes daqui. Vamos pegar o retorno bruto e puro.
        const rawResult = await sequelize.query(
            `SELECT 
                COUNT(r.id) as total_respostas,
                SUM(CASE WHEN a.is_correta = true THEN 1 ELSE 0 END) as acertos,
                SUM(CASE WHEN a.is_correta = false THEN 1 ELSE 0 END) as erros
            FROM resposta_usuario r
            JOIN alternativa a ON r.id_alternativa = a.id
            WHERE r.id_avaliacao_review = :reviewId`,
            {
                replacements: { reviewId: id_avaliacao_review }
            }
        );

        // O TRUQUE DEFINITIVO: Achata qualquer nível de array que o Sequelize mandar
        // e procura direto pelo objeto que tem a nossa resposta.
        const arrayAchatado = [rawResult].flat(Infinity);
        const dados = arrayAchatado.find(item => item && item.total_respostas !== undefined);

        if (!dados || parseInt(dados.total_respostas, 10) === 0) {
            return res.status(404).json({ message: 'Nenhuma resposta encontrada para esta avaliação' });
        }

        const acertos = parseInt(dados.acertos, 10) || 0;
        const erros = parseInt(dados.erros, 10) || 0;
        const total = acertos + erros;

        // Calcula a nota final de 0 a 100
        const notaFinal = total > 0 ? (acertos / total) * 100 : 0;

        res.json({
            message: "Resultado calculado com sucesso",
            acertos,
            erros,
            notaFinal: Math.round(notaFinal)
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar resultado', error: err.message });
    }
};

export const getAnotacoesByAvaliacao = async (req, res) => {
    try {
        const id_avaliacao_review = parseInt(req.params.reviewId, 10);
        
        // Executa a consulta SQL pura para buscar as anotações
        const anotacoes = await sequelize.query(
            `SELECT id, anotacoes 
            FROM resposta_usuario 
            WHERE id_avaliacao_review = :reviewId`,
            {
                replacements: { reviewId: id_avaliacao_review },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json({ anotacoes });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar anotações', error: err.message });
    }
};