import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signAccessToken, revokeAccessToken } from '../services/jwt.service.js';

function sanitizeUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        criado_em: user.criado_em,
        pontos: user.pontos,
        nivel: user.nivel,
        id_avatar: user.id_avatar
    };
}

/**
 * POST /auth/register
 * 
 * Cria um novo usuário com senha criptografada
 */
export const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email e senha são obrigatórios' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Senha deve conter ao menos 8 caracteres' });
    }

    const emailExistente = await User.findOne({ where: { email } });

    if (emailExistente) {
        return res.status(409).json({ message: 'Esse email já está cadastrado no sistema!' });
    }

    const usernameExistente = await User.findOne({ where: { username } });

    if (usernameExistente) {
        return res.status(409).json({ message: 'Esse username já está cadastrado no sistema!' });
    }

    const allowedRoles = ['admin', 'estudante', 'visitante'];
    const normalizedRole = role ?? 'visitante';

    if (!allowedRoles.includes(normalizedRole)) {
        return res.status(400).json({ message: 'Essa role é inválida! Use: admin, estudante ou visitante.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            username,
            email,
            senha_hash: passwordHash,
            role: normalizedRole,
        });

        return res.status(201).json(sanitizeUser(user));
    } catch (error) {
        console.error("ERRO AO CRIAR USUÁRIO:", error);

        return res.status(500).json({
            message: 'Ocorreu um erro ao criar o usuário.',
            error: error.message,
            sqlError: error.parent ? error.parent.message : undefined
        });
    }
};

/**
 * POST /auth/login
 * 
 * Faz login com email e senha, comparando com o hash armazenado no banco.
 * Retorna o token de acesso e os dados do usuário
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const credenciaisValidadas = await bcrypt.compare(password, user.senha_hash);

    if (!credenciaisValidadas) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const accessToken = signAccessToken(user);

    return res.json({
        accessToken,
        tokenType: 'Bearer',
        user: sanitizeUser(user),
    });
};

/**
 * POST /auth/logout
 * 
 * Remove o token de acesso, fazendo logout do usuário
 */
export const logout = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    revokeAccessToken(token);

    return res.json({ message: 'Logout realizado com sucesso' });
};

/**
 * PATCH /auth/update-password
 * 
 * Atualiza a senha do usuário logado, comparando com a senha atual.
 */
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.authUser?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'A senha atual e a nova senha são obrigatórias' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'A nova senha deve conter ao menos 8 caracteres' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.senha_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        user.senha_hash = newPasswordHash;
        await user.save();

        return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error("ERRO AO ATUALIZAR SENHA:", error);
        return res.status(500).json({ message: 'Ocorreu um erro ao atualizar a senha.' });
    }
};