/**
 * Скрипт для миграции данных из поля stripeProductId в поле planId
 * Этот скрипт должен быть запущен после обновления структуры базы данных
 */

import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq, isNotNull } from 'drizzle-orm';

async function migrateStripeToPlanIds() {
  console.log('Starting migration from Stripe to internal plans system...');

  try {
    // Получаем все команды, у которых есть stripeProductId
    const teamsWithStripeProduct = await db.query.teams.findMany({
      where: isNotNull(teams.stripeProductId)
    });

    console.log(`Found ${teamsWithStripeProduct.length} teams with Stripe product IDs to migrate`);

    // Для каждой команды копируем значение из stripeProductId в planId
    for (const team of teamsWithStripeProduct) {
      if (team.stripeProductId) {
        await db.update(teams)
          .set({ 
            planId: team.stripeProductId, 
            updatedAt: new Date() 
          })
          .where(eq(teams.id, team.id));
        
        console.log(`Migrated team ID ${team.id}: "${team.stripeProductId}" -> planId`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Запускаем миграцию
migrateStripeToPlanIds()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Migration process finished.');
    process.exit(0);
  }); 