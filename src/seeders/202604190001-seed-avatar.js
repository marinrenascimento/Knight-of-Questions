export async function up({ queryInterface }) {
    const now = new Date();
    await queryInterface.bulkInsert('Avatars', [
        { id: 1, nome: 'Cavaleiro - Rank Bronze', imagem_url: 'https://exemplo.com/avatares/cavaleiro_bronze.png', nivel_requerido: 0 },
        { id: 2, nome: 'Goblin - Rank Prata', imagem_url: 'https://exemplo.com/avatares/goblin_prata.png', nivel_requerido: 1 },
        { id: 3, nome: 'Elfo - Rank Platina', imagem_url: 'https://exemplo.com/avatares/elfo_platina.png', nivel_requerido: 2 },
        { id: 4, nome: 'Mago - Rank Ouro', imagem_url: 'https://exemplo.com/avatares/mago_ouro.png', nivel_requerido: 3 },
        { id: 5, nome: 'Fada - Rank Paládio', imagem_url: 'https://exemplo.com/avatares/fada_paladio.png', nivel_requerido: 4 },
        { id: 6, nome: 'Esqueleto - Rank Irídio', imagem_url: 'https://exemplo.com/avatares/esqueleto_iridio.png', nivel_requerido: 5 },
        { id: 7, nome: 'Goblin com Roupinha - Rank Ródio', imagem_url: 'https://exemplo.com/avatares/goblin_rodio.png', nivel_requerido: 6 },
        { id: 8, nome: 'Mago com Roupa Nova - Rank Diamante', imagem_url: 'https://exemplo.com/avatares/mago_diamante.png', nivel_requerido: 7 },
        { id: 9, nome: 'Fada com Asas Novas - Rank Rubi', imagem_url: 'https://exemplo.com/avatares/fada_rubi.png', nivel_requerido: 8 },
        { id: 10, nome: 'Elfo com Novo Penteado - Rank Esmeralda', imagem_url: 'https://exemplo.com/avatares/elfo_esmeralda.png', nivel_requerido: 9 },
        { id: 11, nome: 'Cavaleiro com Armadura Personalizada - Rank Diamante Branco', imagem_url: 'https://exemplo.com/avatares/cavaleiro_diamante_branco.png', nivel_requerido: 10 },
    ]);

    // Atualiza a sequência autoincremental no PostgreSQL
    const sequelize = queryInterface.sequelize;
    if (sequelize) {
        await sequelize.query(`SELECT setval('"Avatars_id_seq"', (SELECT MAX(id) FROM "Avatars"));`);
    }
}