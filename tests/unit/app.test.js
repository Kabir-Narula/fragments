// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app'); // Import the app to test

describe('404 Handler', () => {
  test('returns a 404 error for unknown routes', async () => {
    const res = await request(app).get('/nonexistent-route'); // Send request to a nonexistent route
    expect(res.statusCode).toBe(404); // Assert that the status code is 404
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    }); // Assert the response matches the expected 404 error object
  });
});
