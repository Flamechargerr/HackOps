import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';

async function start() {
  await connectDb(env.mongoUri);

  const app = createApp({
    jwtSecret: env.jwtSecret,
    jwtExpiry: env.jwtExpiry,
    corsOrigin: env.corsOrigin,
  });

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`HackOps Node backend listening on :${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start backend', error);
  process.exit(1);
});
