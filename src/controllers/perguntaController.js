import { Pergunta, Alternativa } from '../models/index.js';
import { sequelize } from '../config/sequelize.js';
// Assumindo a criação dos models Alternativa e RespostaUsuario

export const getPerguntasByAvaliacao = async (req, res) => {
    try {
        const id_avaliacao = parseInt(req.params.avaliacaoId, 10);

        const perguntas = await Pergunta.findAll({ 
            where: { id_avaliacao },
            include: [{
                model: Alternativa,
                as: 'alternativas' // Certifique-se de que o alias (as) bate com a associação no seu model (ex: hasMany)
            }]
        });

        if (!perguntas || perguntas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma pergunta encontrada para esta avaliação' });
        }

        res.json(perguntas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar perguntas', error: err.message });
    }
};

export const getPerguntasByFiltro = async (req, res) => {
    try {
        const { disciplina_id, conteudo_id, dificuldade } = req.body;
        
        const perguntas = await Pergunta.findAll({
            where: {
                ...(disciplina_id && { disciplina_id }),
                ...(conteudo_id && { conteudo_id }),
                ...(dificuldade && { nivel_dificuldade: dificuldade })
            }
        });
        
        res.json(perguntas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao filtrar perguntas', error: err.message });
    }
};

export const createPergunta = async (req, res) => {
    try {
        const { enunciado, nivel_dificuldade, disciplina_id, conteudo_id, id_avaliacao } = req.body;
        const pergunta = await Pergunta.create({
            enunciado, nivel_dificuldade, disciplina_id, conteudo_id, id_avaliacao
        });
        // Lógica de alternativas viria aqui usando BulkCreate
        res.status(201).json(pergunta);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar pergunta', error: err.message });
    }
};

export const updatePergunta = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { enunciado, nivel_dificuldade, disciplina_id, conteudo_id } = req.body;

        const pergunta = await Pergunta.findByPk(id);
        if (!pergunta) return res.status(404).json({ message: 'Pergunta não encontrada' });

        await pergunta.update({ enunciado, nivel_dificuldade, disciplina_id, conteudo_id });
        res.json(pergunta);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar pergunta', error: err.message });
    }
};

export const deletePergunta = async (req, res) => {
    // Inicia a transação de segurança
    const transaction = await sequelize.transaction();

    try {
        const id = parseInt(req.params.id, 10);
        
        // Busca a pergunta
        const pergunta = await Pergunta.findByPk(id, { transaction });
        
        if (!pergunta) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Pergunta não encontrada' });
        }

        // 1. Apaga qualquer resposta de teste/usuário que usou essa pergunta
        await sequelize.query(
            `DELETE FROM resposta_usuario WHERE id_pergunta = :id`,
            { 
                replacements: { id }, 
                transaction 
            }
        );

        // 2. Apaga as alternativas (A linha que estava comentada!)
        await Alternativa.destroy({ 
            where: { id_pergunta: id },
            transaction 
        });

        // 3. Finalmente, apaga a pergunta
        await pergunta.destroy({ transaction });

        // Confirma tudo no banco
        await transaction.commit();

        res.json({ message: 'Pergunta, alternativas e histórico removidos com sucesso' });
    } catch (err) {
        // Se der qualquer erro, cancela tudo
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao deletar pergunta', error: err.message });
    }
};

export const getAllPerguntas = async (req, res) => {
    try {
        // Busca todas as perguntas do banco de dados de uma vez só
        const perguntas = await Pergunta.findAll();
        
        // Retorna o array direto
        res.json(perguntas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar perguntas', error: err.message });
    }
};

export const responderPergunta = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id_pergunta, id_alternativa, anotacoes, id_user, id_avaliacao_review } = req.body;

        if (!id_pergunta || !id_alternativa || !id_user) {
            return res.status(400).json({ message: 'IDs da pergunta, alternativa e usuário são obrigatórios.' });
        }

        const data_resposta = new Date();

        // 1. Salva a resposta do usuário
        await sequelize.query(
            `INSERT INTO resposta_usuario (id_pergunta, id_alternativa, anotacoes, id_user, data_resposta, id_avaliacao_review)
             VALUES (:id_pergunta, :id_alternativa, :anotacoes, :id_user, :data_resposta, :id_avaliacao_review)`,
            {
                replacements: {
                    id_pergunta,
                    id_alternativa,
                    anotacoes: anotacoes || null,
                    id_user,
                    data_resposta,
                    id_avaliacao_review: id_avaliacao_review || null
                },
                transaction
            }
        );

        // 2. A BALA DE PRATA: plain: true
        // Isso impede que o Sequelize retorne um [ { ... } ]. Ele retorna apenas { is_correta: true }
        const alternativa = await sequelize.query(
            `SELECT is_correta FROM alternativa WHERE id = :id_alt`,
            { 
                replacements: { id_alt: id_alternativa }, 
                plain: true, // <-- FORÇA O RETORNO A SER UM ÚNICO OBJETO LIMPO
                transaction 
            }
        );

        let acertou = false;
        let pontosGanhos = 0;

        // 3. Como agora garantimos que é um objeto limpo, a verificação vai funcionar direto:
        if (
            alternativa && 
            (
                alternativa.is_correta === true || 
                alternativa.is_correta === 'true' || 
                alternativa.is_correta === 't' || 
                alternativa.is_correta === 1
            )
        ) {
            acertou = true;
            pontosGanhos = 10;

            await sequelize.query(
                `UPDATE "user" SET pontos = pontos + :pontosGanhos WHERE id = :id_user`,
                { 
                    replacements: { pontosGanhos, id_user }, 
                    transaction 
                }
            );
        }

        await transaction.commit();

        res.json({ 
            message: 'Resposta registrada com sucesso!',
            detalhes: {
                acertou,
                pontos_adquiridos: pontosGanhos
            }
        });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao salvar resposta', error: err.message });
    }
};

export const createAlternativa = async (req, res) => {
    try {
        const { texto, is_correta, id_pergunta, descricao } = req.body;

        if (!texto || !id_pergunta) {
            return res.status(400).json({ message: 'Texto e id_pergunta são obrigatórios.' });
        }

        // Verifica se a pergunta realmente existe antes de vincular
        const perguntaExiste = await Pergunta.findByPk(id_pergunta);
        if (!perguntaExiste) {
            return res.status(404).json({ message: 'A pergunta informada não existe.' });
        }

        const novaAlternativa = await Alternativa.create({
            texto,
            is_correta: is_correta || false,
            id_pergunta,
            descricao: descricao || null
        });

        res.status(201).json({ 
            message: 'Alternativa criada com sucesso!',
            alternativa: novaAlternativa
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar alternativa', error: err.message });
    }
};

// ==========================================
// 2. UPDATE - Atualizar Alternativa
// ==========================================
export const updateAlternativa = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { texto, is_correta, descricao } = req.body;

        const alternativa = await Alternativa.findByPk(id);
        
        if (!alternativa) {
            return res.status(404).json({ message: 'Alternativa não encontrada.' });
        }

        // Atualiza apenas os campos que vieram no body da requisição
        if (texto !== undefined) alternativa.texto = texto;
        if (is_correta !== undefined) alternativa.is_correta = is_correta;
        if (descricao !== undefined) alternativa.descricao = descricao;

        await alternativa.save();

        res.json({ 
            message: 'Alternativa atualizada com sucesso!',
            alternativa 
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar alternativa', error: err.message });
    }
};

// ==========================================
// 3. DELETE - Remover Alternativa
// ==========================================
export const deleteAlternativa = async (req, res) => {
    // Transação de segurança para evitar erro de Foreign Key
    const transaction = await sequelize.transaction();

    try {
        const id = parseInt(req.params.id, 10);
        
        const alternativa = await Alternativa.findByPk(id, { transaction });
        
        if (!alternativa) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Alternativa não encontrada.' });
        }

        // 1. Limpa o rastro na tabela de resposta_usuario para não dar erro de cascata
        await sequelize.query(
            `DELETE FROM resposta_usuario WHERE id_alternativa = :id`,
            { 
                replacements: { id }, 
                transaction 
            }
        );

        // 2. Deleta a alternativa em si
        await alternativa.destroy({ transaction });

        // Confirma a operação no banco
        await transaction.commit();

        res.json({ message: 'Alternativa e seu histórico removidos com sucesso!' });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao deletar alternativa', error: err.message });
    }
};