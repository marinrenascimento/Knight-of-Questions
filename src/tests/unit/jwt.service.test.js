import { describe, expect, it } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../../services/jwt.service.js';

describe('jwt.service', () => {
    it('deve assinar e validar token com sub e email', () => {
        const token = signAccessToken({ id: 7, email: 'aluno@teste.com' });
        const payload = verifyAccessToken(token);
        expect(payload.sub).toBe('7');
        expect(payload.email).toBe('aluno@teste.com');
    });
});