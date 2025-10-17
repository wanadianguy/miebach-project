import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { config } from 'dotenv';
import { resolve } from 'path';

if (!process.env.DB_HOST) config({ path: resolve('.env') });

export default defineConfig({
    migrations: { path: './migrations' },
    host: 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    extensions: [Migrator],
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
});
