import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signAccessToken } from '../services/jwt.service.js';

function sanitizeUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        criado_em: user.criado_em,
    };
}

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email e password são obrigatórios' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'password deve conter ao menos 6 caracteres' });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
        return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const allowedRoles = ['admin', 'visitante'];
    const normalizedRole = role ?? 'visitante';

    if (!allowedRoles.includes(normalizedRole)) {
        return res.status(400).json({ message: 'role inválida. Use: admin ou visitante' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            username,
            email,
            senha_hash: passwordHash,
            role: normalizedRole,
            id_avatar: 1
        });
        return res.status(201).json(sanitizeUser(user));
    } catch (error) {
        console.error("ERRO AO CRIAR USUÁRIO:", error);
        return res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message,
            sqlError: error.parent ? error.parent.message : undefined
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'email e password são obrigatórios' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const ok = await bcrypt.compare(password, user.senha_hash);

    if (!ok) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const accessToken = signAccessToken(user);

    return res.json({
        accessToken,
        tokenType: 'Bearer',
        user: sanitizeUser(user),
    });
};