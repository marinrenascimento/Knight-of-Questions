export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('Users', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(50), allowNull: false },
        email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
        senha_hash: { type: Sequelize.STRING(255), allowNull: false },
        pontos: { type: Sequelize.INTEGER, defaultValue: 0 },
        nivel: { type: Sequelize.INTEGER, defaultValue: 0 },
        id_avatar: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'Avatars', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        criado_em: { type: Sequelize.DATE, allowNull: false },
    });
}