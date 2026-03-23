export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('Users', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: Sequelize.STRING(120), allowNull: false },
        email: { type: Sequelize.STRING(200), allowNull: false, unique: true },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
}