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

test('GET /api/health/ready returns 503 when DB is disconnected', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health/ready`);
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.status, 'not_ready');
  } finally {
    server.close();
  }
});

test('GET /api/progress/me without token returns 401 envelope', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/progress/me`);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error.code, 'UNAUTHORIZED');
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
    const body = await response.json();
    assert.equal(body.error.code, 'INVALID_REGISTRATION_PAYLOAD');
  } finally {
    server.close();
  }
});

test('POST /api/auth/login validates payload', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'u', password: '' }),
    });
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error.code, 'INVALID_LOGIN_PAYLOAD');
  } finally {
    server.close();
  }
});

test('GET /api/auth/me without token returns 401 envelope', async () => {
  const app = createApp(config);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/me`);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error.code, 'UNAUTHORIZED');
  } finally {
    server.close();
  }
});
