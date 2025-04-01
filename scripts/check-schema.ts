import { queryClient } from '../lib/db/drizzle';
import * as schema from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function checkSchema() {
  console.log('Checking database schema...\n');
  
  try {
    // Get tables from database
    console.log('Fetching tables from database...');
    const tablesResult = await queryClient`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename != '__drizzle_migrations'
    `;
    
    const dbTables = tablesResult.map((r: any) => r.tablename as string);
    console.log('Tables in database:', dbTables);
    
    // Get tables from schema
    const schemaTableNames = [
      'users',
      'teams',
      'team_members',
      'activity_logs',
      'invitations',
      'customers'
    ];
    
    console.log('\nTables defined in schema:', schemaTableNames);
    
    // Compare tables
    const missingTables = schemaTableNames.filter(table => !dbTables.includes(table));
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables in database:', missingTables);
      console.log('You should run migrations to create these tables.');
    } else {
      console.log('\n✅ All schema tables exist in the database.');
    }
    
    const extraTables = dbTables.filter(table => !schemaTableNames.includes(table) && table !== '__drizzle_migrations');
    if (extraTables.length > 0) {
      console.log('\n⚠️  Extra tables in database not in schema:', extraTables);
    }
    
    // Check table columns for the existing tables
    console.log('\nChecking table columns...');
    for (const tableName of dbTables) {
      if (tableName === '__drizzle_migrations') continue;
      
      const columnsResult = await queryClient`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      `;
      
      const columns = columnsResult.map((r: any) => ({
        name: r.column_name,
        type: r.data_type
      }));
      
      console.log(`\nTable ${tableName} has ${columns.length} columns:`);
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });
    }
    
    console.log('\n✨ Schema check completed.');
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    await queryClient.end();
  }
}

checkSchema().catch(console.error); 