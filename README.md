# Knight of Questions

Knight of Questions é um projeto de Desenvolvimento Web e Abex V que propõe uma plataforma de estudos gamificada com estética medieval que utiliza questões, flashcards e rankings para incentivar o aprendizado.

## Funcionalidades

Cada controlador possui suas rotas e elas estão declaradas no seu respectivo arquivo na pasta \src\routes.

Segue abaixo um resumo das funcionalidades de cada controlador:

### Autenticação
- Cadastro de usuário
- Login
- Logout
- Alteração de senha

### Usuários
- Listagem de usuários do sistema (apenas para admin)
- Visualização de usuário
- Atualização de usuário
- Deleção de usuário

### Avatares
- Listagem de avatares
- Visualização de avatares disponíveis por usuário
- Visualização de avatar selecionado pelo usuário
- Seleção/troca de avatar

### Conteúdos
- Criação de conteúdo
- Listagem de conteúdo
- Atualização de conteúdo
- Deleção de conteúdo

### Disciplinas
- Criação de disciplina
- Listagem de disciplina
- Atualização de disciplina
- Deleção de disciplina

### Flashcards
- Criação de flashcard
- Listagem de flashcard
- Atualização de flashcard
- Deleção de flashcard


### Perguntas
- Criação de pergunta
- Listagem de pergunta
- Atualização de pergunta
- Deleção de pergunta

## Tecnologias utilizadas no projeto

### Backend

- Express.js: para gerenciar as rotas e requisições
- Sequelize: ORM utilizado para gerenciar o banco de dados
- PostgreSQL: banco de dados utilizado para armazenar os dados
- JWT: para autenticação
- Docker: para gerenciar o banco de dados postgres

## Como rodar o projeto?

- Iniciar o docker:

```bash
docker compose up -d
```

- Instalar as dependências:
```bash
npm install
```

- Rodar as migrations
```bash
npm run db:migrate
```

- Rodar os seeds para popular o banco com dados fake
```bash
npm run db:seed
```

- Iniciar o servidor
```bash
npm start
```

# Como acessar o banco de dados:

Para acessar o banco de dados, acessar http://localhost:8080 com o usuário `postgres` e senha `postgrespw`