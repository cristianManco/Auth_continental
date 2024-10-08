import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => ({
  db: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connection: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    name: process.env.DB_NAMELOCAL,
    atlas: process.env.DB_NAME,
    cluster: process.env.DB_CLUSTER,
  },
  env: process.env.NODE_ENV || 'local',
}));
