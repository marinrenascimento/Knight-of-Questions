import { User } from './user.model.js';
import { Avatar } from './avatar.model.js';
import { Disciplina } from './disciplina.model.js';
import { Conteudo } from './conteudo.model.js';
import { Deck } from './deck.model.js';
import { Flashcard } from './flashcard.model.js';
import { Avaliacao } from './avaliacao.model.js';
import { Pergunta } from './pergunta.model.js';
import { Alternativa } from './alternativa.model.js';

let initialized = false;

export function initModels() {
  if (initialized) return;
  initialized = true;

  // Avatar - Usuário
  User.belongsTo(Avatar, { as: 'avatar', foreignKey: 'id_avatar' });
  Avatar.hasMany(User, { as: 'usuarios', foreignKey: 'id_avatar' });
  
  // User - Deck
  User.hasMany(Deck, { as: 'decks', foreignKey: 'id_user' });
  Deck.belongsTo(User, { as: 'usuario', foreignKey: 'id_user' });

  // Disciplina - Conteudo
  Disciplina.hasMany(Conteudo, { as: 'conteudos', foreignKey: 'disciplina_id' });
  Conteudo.belongsTo(Disciplina, { as: 'disciplina', foreignKey: 'disciplina_id' });

  // Deck - Flashcard
  Deck.hasMany(Flashcard, { as: 'flashcards', foreignKey: 'id_deck' });
  Flashcard.belongsTo(Deck, { as: 'deck', foreignKey: 'id_deck' });

  // Pergunta com suas entidades
  Pergunta.belongsTo(Disciplina, { as: 'disciplina', foreignKey: 'disciplina_id' });
  Pergunta.belongsTo(Avaliacao, { as: 'avaliacao', foreignKey: 'id_avaliacao' });
  Pergunta.belongsTo(Conteudo, { as: 'conteudo', foreignKey: 'conteudo_id' });

  // Pergunta - Alternativa (Adicionado)
  Pergunta.hasMany(Alternativa, { as: 'alternativas', foreignKey: 'id_pergunta' });
  Alternativa.belongsTo(Pergunta, { as: 'pergunta', foreignKey: 'id_pergunta' });
}

export { 
  User, Avatar, Disciplina, Conteudo, Deck, Flashcard, Avaliacao, Pergunta, Alternativa 
};