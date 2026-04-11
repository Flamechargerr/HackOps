const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
const MAX_EMAIL_LENGTH = 254;

export function normalizeUsername(value = '') {
  return String(value).trim();
}

function isValidEmail(value) {
  if (!value || value.length > MAX_EMAIL_LENGTH || value.includes(' ')) return false;
  const at = value.indexOf('@');
  if (at <= 0 || at !== value.lastIndexOf('@')) return false;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (!local || !domain || domain.startsWith('.') || domain.endsWith('.')) return false;

  const dot = domain.indexOf('.');
  if (dot <= 0 || dot === domain.length - 1) return false;

  return true;
}

export function validateRegisterPayload(body) {
  const username = normalizeUsername(body?.username);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  const valid = usernameRegex.test(username)
    && isValidEmail(email)
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
