export async function up({ queryInterface }) {
    await queryInterface.bulkInsert('flashcard', [
        { id: 1, frente: 'Qual a fórmula da Segunda Lei de Newton (Princípio Fundamental da Dinâmica)?', verso: 'F = m . a', id_deck: 1, dificuldade: 1, id_disciplina: 4, id_conteudo: 4 },
        { id: 2, frente: 'O que diz a Terceira Lei de Newton?', verso: 'Para toda ação, há uma reação de mesma intensidade, mesma direção e sentido oposto.', id_deck: 1, dificuldade: 2, id_disciplina: 4, id_conteudo: 4 },
        { id: 3, frente: 'Qual a principal função da Mitocôndria?', verso: 'Respiração celular e produção de energia (ATP).', id_deck: 2, dificuldade: 1, id_disciplina: 3, id_conteudo: 3 },
        { id: 4, frente: 'O que são os Ribossomos?', verso: 'Organelas responsáveis pela síntese de proteínas.', id_deck: 2, dificuldade: 2, id_disciplina: 3, id_conteudo: 3 },
    ]);

    const sequelize = queryInterface.sequelize;

    if (sequelize) {
        await sequelize.query(`SELECT setval('"flashcard_id_seq"', (SELECT MAX(id) FROM "flashcard"));`);
    }
}