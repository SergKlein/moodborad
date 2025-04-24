import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Для запросов (с пулом соединений)
const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, { schema });

// Для миграций (без пула)
const migrationClient = postgres(connectionString, { max: 1 });
export const migrationDb: PostgresJsDatabase<typeof schema> = drizzle(migrationClient, { schema });

// Export the underlying postgres client for migrations if needed elsewhere
export { migrationClient }; 