import { createDefaultPlans } from '@/modules/credits';

/**
 * Инициализирует стандартные планы подписки в системе.
 * Этот скрипт можно запускать при начальной настройке системы
 * или для восстановления стандартных планов.
 */
async function initializePlans() {
  console.log('Starting plan initialization...');
  
  try {
    await createDefaultPlans();
    console.log('Default plans created successfully!');
  } catch (error) {
    console.error('Error initializing plans:', error);
    process.exit(1);
  }
}

// Запуск инициализации планов
initializePlans(); 