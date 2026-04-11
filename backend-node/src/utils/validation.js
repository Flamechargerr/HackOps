const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeUsername(value = '') {
  return String(value).trim();
}

export function validateRegisterPayload(body) {
  const username = normalizeUsername(body?.username);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  const valid = usernameRegex.test(username)
    && simpleEmailRegex.test(email)
    && password.length >= 8;

  return {
    valid,
    value: { username, email, password },
  };
}

export function validateLoginPayload(body) {
  const username = normalizeUsername(body?.username);
  const password = String(body?.password ?? '');

  return {
    valid: usernameRegex.test(username) && password.length > 0,
    value: { username, password },
  };
}
