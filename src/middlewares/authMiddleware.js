import { User } from '../models/index.js';
import { verifyAccessToken } from '../services/jwt.service.js';

export const requireAuth = async (req, res, next) => {
    const header = req.headers.authorization ?? '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Token ausente ou inválido' });
    }

    try {
        const payload = verifyAccessToken(token);
        const userId = Number.parseInt(payload.sub, 10);
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({ message: 'Usuário do token não encontrado' });
        }

        req.authUser = { id: user.id, email: user.email, username: user.username, role: user.role };
        return next();
    } catch (err) {
        console.error("JWT Error:", err);
        return res.status(401).json({ message: 'Token inválido ou expirado', detalhe: err.message });
    }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
    const userRole = req.authUser?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
            message: 'Acesso negado para este perfil'
        });
    }
    return next();
};

const rolePermissions = {
    admin: ['users:read', 'users:update', 'posts:read', 'posts:create', 'posts:update', 'posts:delete'],
    visitante: ['posts:read']
};

export const requirePermission = (permission) => (req, res, next) => {
    const userRole = req.authUser?.role;

    // hasPermission check
    const hasPermission = (role, perm) => {
        return rolePermissions[role]?.includes(perm) || false;
    };

    console.log(`[DEBUG PERMISSION] userRole: '${userRole}', requested: '${permission}', allowed: ${hasPermission(userRole, permission)}`);

    if (!userRole || !hasPermission(userRole, permission)) {
        return res.status(403).json({ message: 'Permissão insuficiente para este recurso' });
    }
    return next();
};
