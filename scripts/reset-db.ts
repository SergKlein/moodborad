import { db, migrationClient } from '../lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { green, red, yellow, blue } from './console-colors';

async function resetDatabase() {
  try {
    console.log(blue('\n🔄 Starting database reset...\n'));

    // 1. Drop all tables
    console.log(yellow('Step 1: Dropping all tables...'));
    await db.execute(sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);
    console.log(green('✓ All tables dropped successfully'));

    // 2. Run migrations
    console.log(yellow('\nStep 2: Running migrations...'));
    await migrate(db, { migrationsFolder: 'lib/db/migrations' });
    console.log(green('✓ Migrations completed successfully'));

    console.log(green('\n✨ Database reset completed successfully!\n'));
    
    // Close the connection
    await migrationClient.end();
    process.exit(0);
  } catch (error) {
    console.error(red('\n❌ Error resetting database:'));
    console.error(error);
    await migrationClient.end();
    process.exit(1);
  }
}

resetDatabase(); 