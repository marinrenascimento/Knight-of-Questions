// Dados simulados (em memória)
let flashcards = [
    {
        id: 1,
        front: "O que é HTTP?",
        back: "Protocolo de comunicação usado na web",
        id_deck: 1,
        last_review: 0
    },
    {
        id: 2,
        front: "O que é DNS?",
        back: "Sistema que traduz nomes de domínio para IP",
        id_deck: 1,
        last_review: 0
    }
];


// GET /flashcards/:id
export const getFlashcardById = (req, res) => {

    const id = parseInt(req.params.id);

    const flashcard = flashcards.find(f => f.id === id);

    if (!flashcard) {
        return res.status(404).json({
            message: "Flashcard não encontrado"
        });
    }

    res.json(flashcard);
};



// GET /flashcards/deck/:deckId
// Buscar flashcards de um deck ordenados por revisão
export const getFlashcardsByDeck = (req, res) => {

    const deckId = parseInt(req.params.deckId);

    const deckFlashcards = flashcards
        .filter(f => f.id_deck === deckId)
        .sort((a, b) => a.last_review - b.last_review);

    res.json(deckFlashcards);
};

// POST /flashcards
export const createFlashcard = (req, res) => {

    const { front, back, id_deck } = req.body;

    if (!front || !back || !id_deck) {
        return res.status(400).json({
            message: "front, back e id_deck são obrigatórios"
        });
    }

    const newFlashcard = {
        id: flashcards.length + 1,
        front,
        back,
        id_deck,
        last_review: 0
    };

    flashcards.push(newFlashcard);

    res.status(201).json(newFlashcard);
};



// PUT /flashcards/:id
// Atualiza conteúdo do flashcard
export const updateFlashcard = (req, res) => {

    const id = parseInt(req.params.id);

    const { front, back, id_deck } = req.body;

    const flashcardIndex = flashcards.findIndex(f => f.id === id);

    if (flashcardIndex === -1) {
        return res.status(404).json({
            message: "Flashcard não encontrado"
        });
    }

    flashcards[flashcardIndex] = {
        ...flashcards[flashcardIndex],
        front,
        back,
        id_deck
    };

    res.json(flashcards[flashcardIndex]);
};



// PUT /flashcards/review/:id
// Atualiza somente a ordem de revisão
export const updateFlashcardReview = (req, res) => {

    const id = parseInt(req.params.id);

    const { last_review } = req.body;

    const flashcard = flashcards.find(f => f.id === id);

    if (!flashcard) {
        return res.status(404).json({
            message: "Flashcard não encontrado"
        });
    }

    flashcard.last_review = last_review;

    res.json(flashcard);
};



// DELETE /flashcards/:id
export const deleteFlashcard = (req, res) => {

    const id = parseInt(req.params.id);

    const flashcardIndex = flashcards.findIndex(f => f.id === id);

    if (flashcardIndex === -1) {
        return res.status(404).json({
            message: "Flashcard não encontrado"
        });
    }

    flashcards.splice(flashcardIndex, 1);

    res.status(204).send();
};