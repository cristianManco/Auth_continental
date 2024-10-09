import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => ({
  db: {
    connection: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    name: process.env.DB_NAMELOCAL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    cluster: process.env.DB_CLUSTER,
    atlas: process.env.DB_NAME,
  },
  env: process.env.NODE_ENV || 'local',
}));
