export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('avaliacao', [
        { id: 1, titulo: 'Vestibular Unicamp 2024 - Prova 1', is_vestibular: true, id_user: null },
        { id: 2, titulo: 'Vestibular Unicamp 2024 - Prova 2', is_vestibular: true, id_user: null },
        { id: 3, titulo: 'Vestibular Unicamp 2024 - Prova 3', is_vestibular: true, id_user: null },
        { id: 4, titulo: 'Simulado Ciências da Natureza 2026', is_vestibular: false, id_user: 1 },
        { id: 5, titulo: 'Quiz de História do Carlos', is_vestibular: false, id_user: 3 },
    ]);

    const sequelize = queryInterface.sequelize;

    if (sequelize) {
        await sequelize.query(`SELECT setval('"avaliacao_id_seq"', (SELECT MAX(id) FROM "avaliacao"));`);
    }
}