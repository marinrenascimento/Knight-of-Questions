export async function up({ queryInterface, Sequelize }) {
    await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: 'visitante',
    });
}
export async function down({ queryInterface }) {
    await queryInterface.removeColumn('Users', 'role');
}