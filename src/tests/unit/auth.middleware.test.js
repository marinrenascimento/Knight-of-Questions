import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/jwt.service.js', () => ({
    verifyAccessToken: vi.fn(),
}));

vi.mock('../../models/index.js', () => ({
    User: { findByPk: vi.fn() },
}));

import { verifyAccessToken } from '../../services/jwt.service.js';
import { User } from '../../models/index.js';
import { requireAuth } from '../../middlewares/authMiddleware.js';

function createRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; },
    };
}

describe('authMiddleware.requireAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('deve retornar 401 sem header Authorization', async () => {
        const req = { headers: {} };
        const res = createRes();
        const next = vi.fn();
        await requireAuth(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });
    it('deve retornar 401 para token inválido', async () => {
        verifyAccessToken.mockImplementation(() => { throw new Error('invalid'); });
        const req = { headers: { authorization: 'Bearer token-invalido' } };
        const res = createRes();
        const next = vi.fn();
        await requireAuth(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(next).not.toHaveBeenCalled();
    });
    it('deve chamar next quando token e usuário forem válidos', async () => {
        verifyAccessToken.mockReturnValue({ sub: '1' });
        User.findByPk.mockResolvedValue({ id: 1, email: 'user@mail.com', name: 'User' });
        const req = { headers: { authorization: 'Bearer token-ok' } };
        const res = createRes();
        const next = vi.fn();
        await requireAuth(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.authUser).toEqual({ id: 1, email: 'user@mail.com', name: 'User' });
    });
});