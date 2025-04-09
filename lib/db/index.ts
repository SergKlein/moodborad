import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Для запросов (с пулом соединений)
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// Для миграций (без пула)
export const migrationClient = postgres(connectionString, { max: 1 });
export const migrationDb = drizzle(migrationClient, { schema }); 