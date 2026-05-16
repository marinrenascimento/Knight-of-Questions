export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('conteudo', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: Sequelize.STRING(200), allowNull: true },
        disciplina_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'disciplina', key: 'id' },
        },
    });
}