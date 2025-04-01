import { User } from "@/lib/db/schema";

/**
 * Результат проверки кредитов
 */
export interface CreditCheckResult {
  sufficient: boolean;
  available: number;
  status: string;
}

/**
 * Результат операции списания кредитов
 */
export interface CreditDeductionResult {
  success: boolean;
  remaining: number;
  status: string;
}

/**
 * Информация об использовании кредитов
 */
export interface CreditUsageInfo {
  id: number;
  teamId: number;
  userId: number;
  amount: number;
  operation: string;
  metadata?: any;
  createdAt: Date;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

/**
 * Данные плана
 */
export interface PlanInfo {
  id: number;
  name: string;
  description: string | null;
  creditsPerCycle: number;
  cyclePeriod: string;
  features: PlanFeatures | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Параметры плана
 */
export interface PlanFeatures {
  maxPromptLength?: number;
  supportPriority?: 'low' | 'medium' | 'high';
  priority?: boolean;
  [key: string]: any;
}

/**
 * Статусы кредитов
 */
export enum CreditStatus {
  ACTIVE = 'active',
  EXHAUSTED = 'exhausted',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * Периоды обновления кредитов
 */
export enum CyclePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

/**
 * Типы операций с кредитами
 */
export enum CreditOperationType {
  CONTENT_GENERATION = 'content_generation',
  IMAGE_GENERATION = 'image_generation',
  MODEL_TRAINING = 'model_training',
  EXPORT = 'export',
  MANUAL_ADJUSTMENT = 'manual_adjustment'
} 