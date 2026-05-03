import express from 'express';

const router = express.Router();

export const updateOfensiva = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ erro: "ID não informado" });
    }

    res.status(200).json({
        mensagem: `Ofensiva atualizada para o usuário ${id}`
    });
};

router.put('/update/:id', updateOfensiva);

export default router;