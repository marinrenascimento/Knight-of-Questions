export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('conteudo', [
        { id: 1, nome: 'Trigonometria Básica', disciplina_id: 1 },
        { id: 2, nome: 'Segunda Guerra Mundial', disciplina_id: 2 },
        { id: 3, nome: 'Citologia', disciplina_id: 3 },
        { id: 4, nome: 'Leis de Newton', disciplina_id: 4 },
        { id: 5, nome: 'Estequiometria', disciplina_id: 5 },
    ]);

    const sequelize = queryInterface.sequelize;

    if (sequelize) {
        await sequelize.query(`SELECT setval('"conteudo_id_seq"', (SELECT MAX(id) FROM "conteudo"));`);
    }
}