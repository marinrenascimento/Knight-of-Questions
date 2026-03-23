export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('Posts', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: Sequelize.STRING(180), allowNull: false },
        body: { type: Sequelize.TEXT, allowNull: false },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
}
