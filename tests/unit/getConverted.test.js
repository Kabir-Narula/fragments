const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id.ext', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app).get('/v1/fragments/123.html');
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .get('/v1/fragments/123.html')
      .auth('invalid@email.com', 'incorrect_password');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can convert Markdown to HTML', async () => {
    // Create a Markdown fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello, World!');

    const fragmentId = postRes.body.fragment.id;
    console.log(fragmentId);

    // Convert the fragment to HTML
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toMatch('<h1>Hello, World!</h1>');
    expect(getRes.headers['content-type']).toBe('text/html');
  });

  test('unsupported conversions return 415', async () => {
    // Create a plain text fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const fragmentId = postRes.body.fragment.id;

    // Attempt to convert to HTML (unsupported)
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
  });

  test('non-existent fragment returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/non-existent-id.html')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});