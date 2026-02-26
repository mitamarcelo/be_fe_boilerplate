import request from 'supertest';
import { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { createApp } from '@src/main/app';

describe('API integration', () => {
  let app: Express;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    await prisma.user.deleteMany();
    app = createApp();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
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

  it('POST /api/v1/auth/register returns 201 with normalized email', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'Test@Example.com',
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

  it('POST /api/v1/auth/register returns 409 for case-variant duplicate email', async () => {
    const payload = {
      email: 'Test@Example.com',
      password: 'password123'
    };

    await request(app).post('/api/v1/auth/register').send(payload);
    const duplicate = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(duplicate.status).toBe(409);
  });

  it('POST /api/v1/auth/login returns token with valid credentials', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'TEST@EXAMPLE.COM',
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

  it('persists users across app recreation for login', async () => {
    const appA = createApp();

    await request(appA).post('/api/v1/auth/register').send({
      email: 'persist@example.com',
      password: 'password123'
    });

    const appB = createApp();
    const response = await request(appB).post('/api/v1/auth/login').send({
      email: 'persist@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String)
    });
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
