import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import { Challenge } from '../models/Challenge.js';
import { logger } from '../utils/logger.js';

const seedChallenges = [
  {
    slug: 'password-basics',
    title: 'Password Security Basics',
    category: 'password',
    difficulty: 'beginner',
    points: 100,
    learningObjective: 'Learn basic password hygiene and complexity rules.',
    tags: ['password', 'basics'],
    isActive: true,
  },
  {
    slug: 'xss-context-escape',
    title: 'Escape the XSS Context',
    category: 'xss',
    difficulty: 'intermediate',
    points: 250,
    learningObjective: 'Understand contextual output encoding against reflected XSS.',
    tags: ['xss', 'encoding'],
    isActive: true,
  },
  {
    slug: 'sqli-auth-bypass',
    title: 'SQL Injection Auth Bypass',
    category: 'sql_injection',
    difficulty: 'intermediate',
    points: 300,
    learningObjective: 'Detect and prevent authentication bypass in SQL queries.',
    tags: ['sqli', 'auth'],
    isActive: true,
  },
];

async function run() {
  await connectDb(env.mongoUri);

  try {
    const operations = seedChallenges.map((challenge) => ({
      updateOne: {
        filter: { slug: challenge.slug },
        update: { $set: challenge },
        upsert: true,
      },
    }));

    const result = await Challenge.bulkWrite(operations, { ordered: false });

    logger.info('seed_completed', {
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } finally {
    await disconnectDb();
  }
}

run().catch((error) => {
  logger.error('seed_failed', { errorMessage: error.message });
  process.exit(1);
});
