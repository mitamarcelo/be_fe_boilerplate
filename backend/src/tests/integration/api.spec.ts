import request from 'supertest';
import { Express } from 'express';
import { createApp } from '@src/main/app';

describe('API integration', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  it('GET /api/v1/health returns status payload', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'ok',
        uptime: expect.any(Number),
        timestamp: expect.any(String)
      })
    );
  });

  it('POST /api/v1/auth/register returns 201 with valid payload', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'test@example.com',
        createdAt: expect.any(String)
      })
    );
  });

  it('POST /api/v1/auth/register returns 409 for duplicate email', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123'
    };

    await request(app).post('/api/v1/auth/register').send(payload);
    const duplicate = await request(app).post('/api/v1/auth/register').send(payload);

    expect(duplicate.status).toBe(409);
  });

  it('POST /api/v1/auth/login returns token with valid credentials', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String)
    });
  });

  it('POST /api/v1/auth/login returns 401 with invalid credentials', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
  });

  it('GET /api/v1/auth/me returns 401 without token', async () => {
    const response = await request(app).get('/api/v1/auth/me');
    expect(response.status).toBe(401);
  });

  it('GET /api/v1/auth/me returns 200 with valid token', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@example.com'
    });
  });
});
