import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// For migrations and queries that modify data
export const migrationClient = postgres(connectionString, { max: 1 });

// For regular queries
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
