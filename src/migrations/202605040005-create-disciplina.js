export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('disciplina', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: Sequelize.STRING(200), allowNull: true },
    });
}