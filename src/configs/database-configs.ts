import { IDatabaseConfig } from './type.configs';
import 'dotenv/config';

export const DatabaseConfig: IDatabaseConfig = {
  user: process.env.DATABASE_USER || '',
  host: process.env.DATABASE_HOST || '',
  database: process.env.DATABASE_NAME || '',
  password: process.env.DATABASE_PASSWORD || '',
  port: Number(process.env.DATABASE_PORT || 5432),
};
