export async function up({ queryInterface }) {
    const now = new Date();
    await queryInterface.bulkInsert('Users', [
        { id: 1, name: 'João Silva', email: 'joao@email.com', createdAt: now, updatedAt: now },
        { id: 2, name: 'Maria Souza', email: 'maria@email.com', createdAt: now,updatedAt: now },
    ]);
    await queryInterface.bulkInsert('Posts', [
        { id: 1, title: 'Bem-vindo ao Sequelize', body: '...', userId: 1, createdAt: now, updatedAt: now },
        { id: 2, title: 'Associação 1->N', body: '...', userId: 1, createdAt: now, updatedAt: now },
        { id: 3, title: 'N->1 com belongsTo', body: '...', userId: 2, createdAt:now, updatedAt: now },
    ]);
}
