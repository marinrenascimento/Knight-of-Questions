// Dados simulados (em memória)
let avatars = [
    {
        id: 1,
        name: "Cavaleiro",
        image_url: "https://example.com/knight.png",
        required_level: 1
    },
    {
        id: 2,
        name: "Mago",
        image_url: "https://example.com/wizard.png",
        required_level: 5
    }
];

// GET /avatars - Listar todos
export const getAllAvatars = (req, res) => {
    res.json(avatars);
};

// GET /avatars/:id - Buscar por ID
export const getAvatarById = (req, res) => {
    const id = parseInt(req.params.id);
    const avatar = avatars.find(a => a.id === id);

    if (!avatar) {
        return res.status(404).json({ message: "Avatar não encontrado" });
    }

    res.json(avatar);
};

// POST /avatars - Criar novo
export const createAvatar = (req, res) => {
    const { name, image_url, required_level } = req.body;

    if (!name || !image_url) {
        return res.status(400).json({
            message: "name e image_url são obrigatórios"
        });
    }

    const newAvatar = {
        id: avatars.length + 1,
        name,
        image_url,
        required_level: required_level || 1
    };

    avatars.push(newAvatar);

    res.status(201).json(newAvatar);
};

// PUT /avatars/:id - Atualizar
export const updateAvatar = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, image_url, required_level } = req.body;

    const avatarIndex = avatars.findIndex(a => a.id === id);

    if (avatarIndex === -1) {
        return res.status(404).json({ message: "Avatar não encontrado" });
    }

    avatars[avatarIndex] = {
        ...avatars[avatarIndex],
        name,
        image_url,
        required_level
    };

    res.json(avatars[avatarIndex]);
};

// DELETE /avatars/:id - Remover
export const deleteAvatar = (req, res) => {
    const id = parseInt(req.params.id);
    const avatarIndex = avatars.findIndex(a => a.id === id);

    if (avatarIndex === -1) {
        return res.status(404).json({ message: "Avatar não encontrado" });
    }

    avatars.splice(avatarIndex, 1);

    res.status(204).send(); // No Content
};