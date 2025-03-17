const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/123/info');
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .get('/v1/fragments/123/info')
      .auth('invalid@email.com', 'incorrect_password');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can fetch fragment metadata', async () => {
    // Create a fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const fragmentId = postRes.body.fragment.id;

    // Fetch the fragment metadata
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment).toHaveProperty('id');
    expect(getRes.body.fragment).toHaveProperty('ownerId');
    expect(getRes.body.fragment).toHaveProperty('created');
    expect(getRes.body.fragment).toHaveProperty('updated');
    expect(getRes.body.fragment).toHaveProperty('type');
    expect(getRes.body.fragment).toHaveProperty('size');
  });

  test('non-existent fragment returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/non-existent-id/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});