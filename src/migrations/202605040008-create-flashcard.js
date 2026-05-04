export async function up({ queryInterface, Sequelize }) {
    await queryInterface.createTable('flashcard', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        frente: { type: Sequelize.STRING(200), allowNull: false },
        verso: { type: Sequelize.STRING(255), allowNull: true },
        id_deck: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'deck', key: 'id' } },
        dificuldade: { type: Sequelize.INTEGER, allowNull: true },
        id_disciplina: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'disciplina', key: 'id' } },
        id_conteudo: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'conteudo', key: 'id' } },
    });
}