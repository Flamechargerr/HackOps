import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const config = {
  jwtSecret: 'test-secret-test-secret',
  jwtExpiry: '1d',
  corsOrigin: 'http://localhost:3000',
};

test('GET /api/health returns status ok', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'hackops-node-backend');
  } finally {
    server.close();
  }
});

test('GET /api/progress/me without token returns 401', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/progress/me`);
    assert.equal(response.status, 401);
  } finally {
    server.close();
  }
});

test('POST /api/auth/register validates payload', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'u', email: 'bad', password: '123' }),
    });
    assert.equal(response.status, 400);
  } finally {
    server.close();
  }
});
