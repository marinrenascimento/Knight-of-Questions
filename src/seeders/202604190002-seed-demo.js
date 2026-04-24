export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('Users', [
        { id: 1, username: 'arthur_novato', email: 'arthur@email.com', senha_hash: 'hash1', criado_em: '2026-03-01 10:00:00', pontos: 500, nivel: 0, id_avatar: 1 },
        { id: 2, username: 'bia_estudiosa', email: 'bia@email.com', senha_hash: 'hash2', criado_em: '2026-02-15 14:30:00', pontos: 3500, nivel: 3, id_avatar: 4 },
        { id: 3, username: 'carlos_pro', email: 'carlos@email.com', senha_hash: 'hash3', criado_em: '2025-11-10 09:00:00', pontos: 7500, nivel: 7, id_avatar: 8 },
        { id: 4, username: 'diana_mestre', email: 'diana@email.com', senha_hash: 'hash4', criado_em: '2025-05-20 16:00:00', pontos: 10500, nivel: 10, id_avatar: 11 }
    ]);

    // Atualiza a sequência autoincremental no PostgreSQL
    const sequelize = queryInterface.sequelize;
    if (sequelize) {
        await sequelize.query(`SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM "Users"));`);
    }
}