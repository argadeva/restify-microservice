require('dotenv').config();
const confidence = require('confidence');

const config = {
  cors: {
    origins: process.env.CORS_ORIGINS,
    allowHeaders: process.env.CORS_ALLOW_HEADERS,
    exposeHeaders: process.env.CORS_EXPOSE_HEADERS,
    preflightMaxAge: process.env.CORS_PREFLIGHT_MAX_AGE || 10,
  },
  postgresqlUrl: process.env.POSTGRESQL_URL || 'postgresql://user:password@localhost:5432/dbname',
  redis: {
    url: process.env.REDIS_CLIENT_URL,
    index: process.env.REDIS_CLIENT_INDEX,
  },
};

const store = new confidence.Store(config);

exports.get = (key) => store.get(key);