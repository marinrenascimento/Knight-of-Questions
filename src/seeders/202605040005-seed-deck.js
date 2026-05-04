export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('deck', [
        { id: 1, nome: 'Fórmulas Salva-Vidas de Física', descricao: 'Leis de Newton e Cinemática', criado_em: '2026-03-05 10:00:00', id_user: 3 },
        { id: 2, nome: 'Biologia ENEM', descricao: 'Foco total em Citologia', criado_em: '2026-03-10 15:00:00', id_user: 4 },
    ]);

    const sequelize = queryInterface.sequelize;

    if (sequelize) {
        await sequelize.query(`SELECT setval('"deck_id_seq"', (SELECT MAX(id) FROM "deck"));`);
    }
}