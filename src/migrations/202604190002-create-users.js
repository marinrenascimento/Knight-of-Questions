export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('Users', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
        nome: { type: Sequelize.STRING(100), allowNull: false },
        username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
        senha_hash: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '', },
        pontos: { type: Sequelize.INTEGER, defaultValue: 0 },
        nivel: { type: Sequelize.INTEGER, defaultValue: 0 },
        id_avatar: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: { model: 'Avatars', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
}