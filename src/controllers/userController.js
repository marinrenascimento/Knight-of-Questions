// Dados simulados (em memória)
let users = [
    {
        id: 1,
        username: "joao123",
        email: "joao@email.com",
        password_hash: "hash123",
        created_at: new Date(),
        points: 100,
        level: 2
    },
    {
        id: 2,
        username: "mariazinha",
        email: "maria@email.com",
        password_hash: "hash456",
        created_at: new Date(),
        points: 250,
        level: 4
    }
];

// GET /users - Listar todos
export const getAllUsers = (req, res) => {
    res.json(users);
};

// GET /users/:id - Buscar por ID
export const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
};

// POST /users - Criar novo
export const createUser = (req, res) => {
    const { username, email, password_hash, points, level } = req.body;

    if (!username || !email || !password_hash) {
        return res.status(400).json({
            message: "username, email e password_hash são obrigatórios"
        });
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password_hash,
        created_at: new Date(),
        points: points || 0,
        level: level || 1
    };

    users.push(newUser);

    res.status(201).json(newUser);
};

// PUT /users/:id - Atualizar
export const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, email, password_hash, points, level } = req.body;

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    users[userIndex] = {
        ...users[userIndex],
        username,
        email,
        password_hash,
        points,
        level
    };

    res.json(users[userIndex]);
};

// DELETE /users/:id - Remover
export const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    users.splice(userIndex, 1);

    res.status(204).send(); // No Content
};