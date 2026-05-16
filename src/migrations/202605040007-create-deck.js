export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('deck', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: Sequelize.STRING(200), allowNull: false },
        descricao: { type: Sequelize.STRING(255), allowNull: true },
        criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        id_user: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    });
}