import { db } from './db/drizzle';
import { eq, and } from 'drizzle-orm';
import { 
  teams, 
  plans, 
  users, 
  creditUsage, 
  activityLogs,
  ActivityType
} from './db/schema';

/**
 * Проверяет наличие достаточного количества кредитов у команды
 */
export async function checkCredits(
  teamId: number, 
  requiredAmount: number = 1
): Promise<{
  sufficient: boolean, 
  available: number,
  status: string
}> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team) {
    return { sufficient: false, available: 0, status: 'not_found' };
  }
  
  // Проверяем, не истек ли срок действия кредитов
  if (team.creditsReset && new Date() > new Date(team.creditsReset)) {
    await resetCredits(teamId);
    // Обновляем данные после сброса
    return checkCredits(teamId, requiredAmount);
  }
  
  const available = (team.creditsTotal || 0) - (team.creditsUsed || 0);
  const status = team.subscriptionStatus || 'inactive';
  
  return {
    sufficient: available >= requiredAmount && status === 'active',
    available,
    status
  };
}

/**
 * Списывает кредиты за операцию генерации контента
 */
export async function deductCredits(
  teamId: number,
  userId: number,
  amount: number,
  operation: string,
  metadata?: any
): Promise<{ 
  success: boolean, 
  remaining: number, 
  status: string 
}> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team || team.subscriptionStatus !== 'active') {
    return { 
      success: false, 
      remaining: 0, 
      status: team?.subscriptionStatus || 'not_found' 
    };
  }
  
  const creditsUsed = (team.creditsUsed || 0) + amount;
  
  // Проверяем, не закончатся ли кредиты после операции
  if (creditsUsed > (team.creditsTotal || 0)) {
    await db.update(teams)
      .set({ 
        subscriptionStatus: 'exhausted',
        updatedAt: new Date()
      })
      .where(eq(teams.id, teamId));
    
    return { success: false, remaining: 0, status: 'exhausted' };
  }
  
  // Записываем использование кредитов
  await db.insert(creditUsage).values({
    teamId,
    userId,
    amount,
    operation,
    metadata: metadata ? metadata : null
  });
  
  // Обновляем количество использованных кредитов
  await db.update(teams)
    .set({ 
      creditsUsed,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
  
  // Логируем активность
  await db.insert(activityLogs).values({
    teamId,
    userId,
    action: ActivityType.CONTENT_GENERATED,
    timestamp: new Date(),
    metadata: {
      creditsUsed: amount,
      operation,
      ...metadata
    }
  });
  
  return { 
    success: true, 
    remaining: (team.creditsTotal || 0) - creditsUsed,
    status: 'active'
  };
}

/**
 * Назначает план команде
 */
export async function assignPlan(
  teamId: number,
  planId: number,
  customCredits?: number
): Promise<boolean> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team) {
    throw new Error('Team not found');
  }
  
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId)
  });
  
  if (!plan || !plan.isActive) {
    throw new Error('Plan not found or inactive');
  }
  
  // Рассчитываем дату следующего сброса кредитов
  const nextReset = calculateNextResetDate(plan.cyclePeriod);
  
  // Используем существующие поля со Stripe, но в новом контексте
  await db.update(teams)
    .set({
      stripeProductId: String(planId), // Используем как ID плана
      planName: plan.name,
      subscriptionStatus: 'active', // Используем как статус кредитов
      creditsTotal: customCredits || plan.creditsPerCycle,
      creditsUsed: 0,
      creditsReset: nextReset,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
    
  // Логируем действие
  await db.insert(activityLogs).values({
    teamId,
    action: ActivityType.PLAN_ASSIGNED,
    timestamp: new Date(),
    metadata: {
      planId,
      planName: plan.name,
      creditsAllocated: customCredits || plan.creditsPerCycle,
      nextReset
    }
  });
  
  return true;
}

/**
 * Сбрасывает кредиты команды в соответствии с планом
 */
export async function resetCredits(teamId: number): Promise<boolean> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team || !team.stripeProductId) {
    return false;
  }
  
  const planId = parseInt(team.stripeProductId);
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId)
  });
  
  if (!plan) {
    return false;
  }
  
  const nextReset = calculateNextResetDate(plan.cyclePeriod);
  
  await db.update(teams)
    .set({
      creditsUsed: 0,
      subscriptionStatus: 'active',
      creditsReset: nextReset,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
  
  // Логируем действие
  await db.insert(activityLogs).values({
    teamId,
    action: ActivityType.CREDITS_RESET,
    timestamp: new Date(),
    metadata: {
      planId,
      planName: plan.name,
      nextReset
    }
  });
  
  return true;
}

/**
 * Добавляет или удаляет кредиты вручную
 */
export async function adjustCredits(
  teamId: number,
  adminUserId: number,
  amount: number,
  reason: string = 'manual_adjustment'
): Promise<boolean> {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId)
  });
  
  if (!team) {
    return false;
  }
  
  const newTotal = Math.max(0, (team.creditsTotal || 0) + amount);
  const statusChange = amount < 0 && newTotal <= (team.creditsUsed || 0)
    ? { subscriptionStatus: 'exhausted' }
    : team.subscriptionStatus !== 'active'
      ? { subscriptionStatus: 'active' }
      : {};
  
  await db.update(teams)
    .set({
      creditsTotal: newTotal,
      ...statusChange,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
  
  // Логируем действие
  await db.insert(activityLogs).values({
    teamId,
    userId: adminUserId,
    action: ActivityType.CREDITS_UPDATED,
    timestamp: new Date(),
    metadata: {
      adjustment: amount,
      reason,
      newTotal
    }
  });
  
  return true;
}

/**
 * Рассчитывает дату следующего сброса кредитов
 */
function calculateNextResetDate(cyclePeriod: string): Date {
  const now = new Date();
  
  switch (cyclePeriod.toLowerCase()) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      now.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      now.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      break;
    default:
      // Если недопустимый период, устанавливаем очень далекую дату
      now.setFullYear(now.getFullYear() + 100);
  }
  
  return now;
}

/**
 * Получает историю использования кредитов команды
 */
export async function getCreditUsageHistory(
  teamId: number,
  limit: number = 50,
  offset: number = 0
) {
  return await db.query.creditUsage.findMany({
    where: eq(creditUsage.teamId, teamId),
    orderBy: (creditUsage, { desc }) => [desc(creditUsage.createdAt)],
    limit,
    offset,
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

/**
 * Получает список всех планов
 */
export async function getPlans(includeInactive: boolean = false) {
  const query = includeInactive 
    ? undefined
    : eq(plans.isActive, true);
    
  return await db.query.plans.findMany({
    where: query,
    orderBy: (plans, { asc }) => [asc(plans.id)]
  });
}

/**
 * Создает базовые планы для начала работы
 */
export async function createDefaultPlans() {
  const existingPlans = await db.query.plans.findMany();
  
  if (existingPlans.length > 0) {
    return; // Планы уже существуют
  }
  
  const defaultPlans = [
    {
      name: 'Free',
      description: 'Basic plan with limited credits',
      creditsPerCycle: 10,
      cyclePeriod: 'monthly',
      features: {
        maxPromptLength: 500,
        supportPriority: 'low'
      },
      isActive: true
    },
    {
      name: 'Standard',
      description: 'Standard plan with more credits',
      creditsPerCycle: 100,
      cyclePeriod: 'monthly',
      features: {
        maxPromptLength: 1000,
        supportPriority: 'medium'
      },
      isActive: true
    },
    {
      name: 'Premium',
      description: 'Premium plan with maximum credits',
      creditsPerCycle: 500,
      cyclePeriod: 'monthly',
      features: {
        maxPromptLength: 2000,
        supportPriority: 'high',
        priority: true
      },
      isActive: true
    }
  ];
  
  await db.insert(plans).values(defaultPlans);
} 