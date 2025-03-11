const request = require('supertest');
const express = require('express');
const authRouter = require('../../routes/api/auth');

const app = express();
app.use(express.json()); // 解析 JSON 请求体
app.use('/api/auth', authRouter);

describe('Auth API', () => {
    test('POST /api/auth/login - failure (wrong credentials)', async () => {
        const UserModel = require('../../models/UserModel');
        UserModel.findOne = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'wronguser', password: 'wrongpassword' });

        expect(response.statusCode).toBe(200);
        expect(response.body.msg).toBe('Database read error~~~');
    });
});
