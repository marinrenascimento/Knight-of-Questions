export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('disciplina', [
        { id: 1, nome: 'Matemática' },
        { id: 2, nome: 'História' },
        { id: 3, nome: 'Biologia' },
        { id: 4, nome: 'Física' },
        { id: 5, nome: 'Química' },
    ]);

    const sequelize = queryInterface.sequelize;

    if (sequelize) {
        await sequelize.query(`SELECT setval('"disciplina_id_seq"', (SELECT MAX(id) FROM "disciplina"));`);
    }
}