import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

type PgRow = any;

const runMigrations = async () => {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('⏳ Running migrations...');
  
  try {
    // Check if tables exist
    let existingTables: string[] = [];
    try {
      const tablesResult = await migrationClient`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename != '__drizzle_migrations'
      `;
      existingTables = tablesResult.map((r: PgRow) => r.tablename as string);
    } catch (error) {
      console.warn('Could not query existing tables:', error);
    }
    
    console.log('\nExisting tables:', existingTables);

    // Run migrations
    const start = Date.now();
    await migrate(db, { 
      migrationsFolder: 'lib/db/migrations',
      migrationsTable: '__drizzle_migrations'
    });
    const end = Date.now();

    // Verify tables after migration
    let tablesAfterMigration: string[] = [];
    try {
      const tablesAfterResult = await migrationClient`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename != '__drizzle_migrations'
      `;
      tablesAfterMigration = tablesAfterResult.map((r: PgRow) => r.tablename as string);
    } catch (error) {
      console.warn('Could not query tables after migration:', error);
    }
    
    console.log('\nTables after migration:', tablesAfterMigration);

    if (tablesAfterMigration.length > existingTables.length) {
      console.log('\n✅ New tables created successfully');
    } else if (tablesAfterMigration.length === existingTables.length) {
      console.log('\n⚠️  No new tables were created. Tables might already exist.');
    }

    console.log(`\n✨ Migration process completed in ${end - start}ms\n`);
  } catch (error) {
    console.error('\n❌ Migration error:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
};

runMigrations().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
}); 