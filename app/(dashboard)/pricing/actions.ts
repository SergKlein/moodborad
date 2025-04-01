'use server';

import { handleSubscription as baseHandleSubscription } from '@/lib/payments/actions';

/**
 * Серверное действие для обработки выбора плана
 */
export async function choosePlan(formData: FormData) {
  const planId = formData.get('planId') as string;
  const teamId = parseInt(formData.get('teamId') as string);
  return baseHandleSubscription(teamId, planId);
} 