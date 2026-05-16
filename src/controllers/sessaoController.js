// Simulação em memória (tipo "banco fake")
let sessoes = [];
let idCounter = 1;

/**
 * POST http://localhost:3000/sessao/start
 * 
 * Inicia uma nova sessão
 */
const startSessao = async (req, res) => {
    try {
        const { user_id } = req.body || {};

        if (!user_id) {
            return res.status(400).json({
                message: "Usuário não informado"
            });
        }

        const novaSessao = {
            id: idCounter++,
            user_id,
            data_login: new Date(),
            data_logout: null,
            qtd_minutos_sessao: null
        };

        sessoes.push(novaSessao);

        return res.status(201).json(novaSessao);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao iniciar sessão",
            details: error.message
        });
    }
};

const endSessao = async (req, res) => {
    try {
        const id = req.params.id ? parseInt(req.params.id) : null;

        if (!id) {
            return res.status(400).json({
                message: "ID da sessão não informado"
            });
        }

        const sessao = sessoes.find(s => s.id === id);

        if (!sessao) {
            return res.status(404).json({
                message: "Sessão não encontrada"
            });
        }

        const data_logout = new Date();

        const diffMs = data_logout - new Date(sessao.data_login);
        const minutos = Math.floor(diffMs / 1000 / 60);

        sessao.data_logout = data_logout;
        sessao.qtd_minutos_sessao = minutos;

        return res.json(sessao);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao finalizar sessão",
            details: error.message
        });
    }
};

// Tempo total de sessões do usuário
const getTempoTotalSessoes = async (req, res) => {
    try {
        const user_id = req.params.user_id ? parseInt(req.params.user_id) : null;

        if (!user_id) {
            return res.status(400).json({
                message: "Usuário não informado"
            });
        }

        const sessoesDoUsuario = sessoes.filter(s => s.user_id === user_id);

        let totalMinutos = 0;

        for (let i = 0; i < sessoesDoUsuario.length; i++) {
            totalMinutos += sessoesDoUsuario[i].qtd_minutos_sessao || 0;
        }

        return res.json({
            total_minutos: totalMinutos
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao calcular tempo total",
            details: error.message
        });
    }
};

export default {
    startSessao,
    endSessao,
    getTempoTotalSessoes
};