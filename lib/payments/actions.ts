'use server';

import { redirect } from 'next/navigation';
import { assignPlan } from '@/modules/credits';

/**
 * Обрабатывает запрос на подписку, назначая план команде
 * через внутреннюю систему кредитов
 */
export async function handleSubscription(teamId: number, planId: string) {
  try {
    await assignPlan(teamId, parseInt(planId));
    return redirect('/dashboard?success=subscription-updated');
  } catch (error) {
    console.error('Error handling subscription:', error);
    return redirect('/dashboard?error=subscription-failed');
  }
}

/**
 * Перенаправляет на панель управления пользователя
 */
export async function handleCustomerPortal() {
  return redirect('/dashboard/settings/billing');
}
