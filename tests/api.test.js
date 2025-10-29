const request = require('supertest');
const app = require('../server');

describe('Quiz API (integration)', () => {
  test('POST /api/submitQuiz returns 201 and score', async () => {
    const payload = {
      q1: 'Chandragupta Maurya',
      q2: '1947',
      q3: 'Bihar',
      q4: 'Bahadur Shah Zafar',
      q5: 'Civil Disobedience Movement'
    };

    const res = await request(app).post('/api/submitQuiz').send(payload).expect(201);
    expect(res.body).toHaveProperty('score', 5);
    expect(res.body).toHaveProperty('resultId');
  });
});
