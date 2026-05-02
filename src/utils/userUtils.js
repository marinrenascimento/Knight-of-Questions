export function sanitizeUser(user) {
    return {
        id: user.id,
        nome: user.nome,
        username: user.username,
        email: user.email,
        role: user.role,
        criado_em: user.criado_em,
        pontos: user.pontos,
        nivel: user.nivel,
        id_avatar: user.id_avatar
    };
}
