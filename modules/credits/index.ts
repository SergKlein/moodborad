/**
 * Credit System Module
 * 
 * This module provides functionality for managing credit-based operations
 * within the application, including checking, deducting, and resetting credits,
 * as well as managing subscription plans.
 */

// Экспорт всего API модуля
export * from './types';
export * from './utils';
export * from './components';

// Экспорт основных функций для работы с кредитами
import {
  checkCredits,
  deductCredits,
  assignPlan,
  resetCredits,
  adjustCredits,
  getPlans,
  getCreditUsageHistory,
  createDefaultPlans
} from './service';

export {
  checkCredits,
  deductCredits,
  assignPlan,
  resetCredits,
  adjustCredits,
  getPlans,
  getCreditUsageHistory,
  createDefaultPlans
}; 