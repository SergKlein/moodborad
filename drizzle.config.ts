import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  // Указывает, что мы используем SQL-файлы для миграций вместо TypeScript
  verbose: true,
  strict: true,
} satisfies Config;
