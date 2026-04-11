function base(level, message, extra = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...extra,
  };

  const serialized = JSON.stringify(entry);
  if (level === 'error') {
    console.error(serialized);
    return;
  }
  console.log(serialized);
}

export const logger = {
  info(message, extra) {
    base('info', message, extra);
  },
  warn(message, extra) {
    base('warn', message, extra);
  },
  error(message, extra) {
    base('error', message, extra);
  },
};
