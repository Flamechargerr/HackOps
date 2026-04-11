import dotenv from 'dotenv';

dotenv.config();

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

const requiredAlways = ['JWT_SECRET'];
const requiredInProduction = ['MONGODB_URI', 'CORS_ORIGIN'];

for (const key of requiredAlways) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (isProduction) {
  for (const key of requiredInProduction) {
    if (!process.env[key]) {
      throw new Error(`Missing required production environment variable: ${key}`);
    }
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackops',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
