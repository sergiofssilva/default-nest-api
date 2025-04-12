import { Account } from '../account/entities/account.entity';
import { Lead } from '../lead/entities/lead.entity';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Account, Lead],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
