const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).post('/v1/fragments');
    expect(res.statusCode).toBe(401);
    expect(res.body.error.message).toBe('Unauthorized');
  });

  test('authenticated users can create text/plain fragments', async () => {
    const text = 'Test content'; // Actual length: 11 characters
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(text);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment).toMatchObject({
      id: expect.any(String),
      type: 'text/plain',
      size: Buffer.byteLength(text), // 11 bytes
    });
  });

  test('authenticated users can create text/markdown fragments', async () => {
    const markdown = '# Hello, World!';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdown);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment).toMatchObject({
      id: expect.any(String),
      type: 'text/markdown',
      size: Buffer.byteLength(markdown),
    });
  });

  test('authenticated users can create application/json fragments', async () => {
    const json = JSON.stringify({ key: 'value' });
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(json);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment).toMatchObject({
      id: expect.any(String),
      type: 'application/json',
      size: Buffer.byteLength(json),
    });
  });

  test('invalid Content-Type returns 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'invalid/type')
      .send('content');

    expect(res.statusCode).toBe(415);
  });

  test('empty body returns 400', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('');

    expect(res.statusCode).toBe(400);
  });

  describe('Location header', () => {
    test('uses API_URL environment variable', async () => {
      process.env.API_URL = 'https://api.example.com';

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('content');

      expect(res.headers.location).toMatch(
        new RegExp(`^${process.env.API_URL}/v1/fragments/[a-fA-F0-9-]+$`)
      );

      delete process.env.API_URL; // Cleanup
    });

    test('falls back to request host when API_URL is unset', async () => {
      delete process.env.API_URL;

      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('content');

      expect(res.headers.location).toMatch(
        /^http:\/\/127.0.0.1:\d+\/v1\/fragments\/[a-fA-F0-9-]+$/
      );
    });
  });

  test('supports charset in Content-Type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('content');
    expect(res.statusCode).toBe(201);
  });
});