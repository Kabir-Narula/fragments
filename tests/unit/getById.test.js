const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/123');
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .get('/v1/fragments/123')
      .auth('invalid@email.com', 'incorrect_password');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can fetch fragment data', async () => {
    // Create a fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const fragmentId = postRes.body.fragment.id;

    // Fetch the fragment data
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('This is a fragment');
    expect(getRes.headers['content-type']).toBe('text/plain; charset=utf-8');
  });

  test('non-existent fragment returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/non-existent-id')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});