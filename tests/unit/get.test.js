const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // test('expand=1 returns full fragment metadata', async () => {
  //   const res = await request(app)
  //     .get('/v1/fragments?expand=1')
  //     .auth('user1@email.com', 'password1');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(Array.isArray(res.body.fragments)).toBe(true);
  //   if (res.body.fragments.length > 0) {
  //     // Check for the expected full metadata fields
  //     expect(res.body.fragments[0]).toHaveProperty('id');
  //     expect(res.body.fragments[0]).toHaveProperty('ownerId');
  //     expect(res.body.fragments[0]).toHaveProperty('created');
  //     expect(res.body.fragments[0]).toHaveProperty('updated');
  //     expect(res.body.fragments[0]).toHaveProperty('type');
  //     expect(res.body.fragments[0]).toHaveProperty('size');
  //   }
  // });

//   test('expand=1 with no fragments returns empty array', async () => {
//     // Simulate a user with no fragments
//     const res = await request(app)
//       .get('/v1/fragments?expand=1')
//       .auth('user_with_no_fragments@email.com', 'password123');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.status).toBe('ok');
//     expect(Array.isArray(res.body.fragments)).toBe(true);
//     expect(res.body.fragments.length).toBe(0);
//   });
 });
