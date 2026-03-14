// Dados simulados (em memória)
let decks = [
    {
        id: 1,
        name: "Algoritmos Básicos",
        description: "Deck para estudar lógica de programação",
        created_at: new Date(),
        id_user: 1
    },
    {
        id: 2,
        name: "Redes de Computadores",
        description: "Deck com conceitos de redes",
        created_at: new Date(),
        id_user: 2
    }
];

// GET /users/:id_user/decks - Listar decks do usuário
export const getAllDecksByUser = (req, res) => {
    const id_user = parseInt(req.params.id_user);

    const userDecks = decks.filter(deck => deck.id_user === id_user);

    res.json(userDecks);
};

// GET /users/:id_user/decks/:id - Buscar deck por ID do usuário
export const getDeckById = (req, res) => {
    const id = parseInt(req.params.id);
    const id_user = parseInt(req.params.id_user);

    const deck = decks.find(d => d.id === id && d.id_user === id_user);

    if (!deck) {
        return res.status(404).json({ message: "Deck não encontrado" });
    }

    res.json(deck);
};

// POST /users/:id_user/decks - Criar novo deck
export const createDeck = (req, res) => {
    const id_user = parseInt(req.params.id_user);
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "name é obrigatório"
        });
    }

    const newDeck = {
        id: decks.length + 1,
        name,
        description: description || "",
        created_at: new Date(),
        id_user
    };

    decks.push(newDeck);

    res.status(201).json(newDeck);
};

// PUT /users/:id_user/decks/:id - Atualizar deck
export const updateDeck = (req, res) => {
    const id = parseInt(req.params.id);
    const id_user = parseInt(req.params.id_user);
    const { name, description } = req.body;

    const deckIndex = decks.findIndex(
        d => d.id === id && d.id_user === id_user
    );

    if (deckIndex === -1) {
        return res.status(404).json({ message: "Deck não encontrado" });
    }

    decks[deckIndex] = {
        ...decks[deckIndex],
        name,
        description
    };

    res.json(decks[deckIndex]);
};

// DELETE /users/:id_user/decks/:id - Remover deck
export const deleteDeck = (req, res) => {
    const id = parseInt(req.params.id);
    const id_user = parseInt(req.params.id_user);

    const deckIndex = decks.findIndex(
        d => d.id === id && d.id_user === id_user
    );

    if (deckIndex === -1) {
        return res.status(404).json({ message: "Deck não encontrado" });
    }

    decks.splice(deckIndex, 1);

    res.status(204).send(); // No Content
};