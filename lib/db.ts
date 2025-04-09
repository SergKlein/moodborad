import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Создаем экземпляр postgres-клиента
const queryClient = postgres(process.env.DATABASE_URL!);

// Создаем экземпляр Drizzle с postgres-клиентом
export const db = drizzle(queryClient); 