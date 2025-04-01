import { CyclePeriod } from './types';

/**
 * Форматирует дату сброса кредитов в понятный для пользователя формат
 */
export function formatResetDate(date: Date): string {
  if (!date) return 'No reset date';
  
  const now = new Date();
  const resetDate = new Date(date);
  
  const diffTime = Math.abs(resetDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else {
    return resetDate.toLocaleDateString();
  }
}

/**
 * Рассчитывает стоимость операции в кредитах в зависимости от параметров
 */
export function calculateOperationCost(
  operationType: string,
  params: { 
    promptLength?: number; 
    complexity?: 'low' | 'medium' | 'high';
    quality?: 'low' | 'medium' | 'high';
    [key: string]: any;
  } = {}
): number {
  const { promptLength = 0, complexity = 'medium', quality = 'medium' } = params;
  
  // Базовая стоимость
  let cost = 1;
  
  // Модификаторы на основе длины запроса
  if (promptLength > 100) {
    cost += Math.floor(promptLength / 200);
  }
  
  // Модификаторы на основе сложности
  if (complexity === 'high') {
    cost *= 1.5;
  } else if (complexity === 'low') {
    cost *= 0.75;
  }
  
  // Модификаторы на основе качества
  if (quality === 'high') {
    cost *= 2;
  } else if (quality === 'low') {
    cost *= 0.5;
  }
  
  // Округление и минимальная стоимость
  return Math.max(1, Math.round(cost));
}

/**
 * Получает человекочитаемое описание цикла обновления кредитов
 */
export function getCyclePeriodDescription(cyclePeriod: string): string {
  switch (cyclePeriod.toLowerCase()) {
    case CyclePeriod.DAILY:
      return 'Daily (credits reset every day at midnight)';
    case CyclePeriod.WEEKLY:
      return 'Weekly (credits reset every week)';
    case CyclePeriod.MONTHLY:
      return 'Monthly (credits reset on the 1st day of each month)';
    default:
      return 'Custom cycle period';
  }
}

/**
 * Проверяет, скоро ли закончатся кредиты у команды
 */
export function isLowOnCredits(total: number, used: number): boolean {
  if (total <= 0 || used <= 0) return false;
  
  const remaining = total - used;
  const percentUsed = (used / total) * 100;
  
  // Возвращает true, если осталось меньше 20% кредитов или меньше 5 кредитов
  return percentUsed > 80 || remaining < 5;
} 