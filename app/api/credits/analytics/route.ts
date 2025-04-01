import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserWithTeam } from '@/lib/db/queries';
import { getCreditUsageHistory, checkCredits } from '@/modules/credits';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }
    
    const user = await getUserWithTeam(session.user.id);
    
    if (!user || !user.teamId) {
      return NextResponse.json(
        { success: false, error: { message: 'Team not found' } },
        { status: 404 }
      );
    }
    
    const teamId = user.teamId;
    
    // Получаем информацию о текущих кредитах
    const creditStatus = await checkCredits(teamId);
    
    // Получаем историю использования кредитов
    const usageHistory = await getCreditUsageHistory(teamId);
    
    // Группируем использование кредитов по типу операции
    const usageByOperation = usageHistory.reduce((acc, item) => {
      const operation = item.operation;
      if (!acc[operation]) {
        acc[operation] = 0;
      }
      acc[operation] += item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Группируем использование по дням
    const usageByDay = usageHistory.reduce((acc, item) => {
      const day = new Date(item.createdAt).toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      data: {
        currentStatus: creditStatus,
        totalUsage: usageHistory.reduce((sum, item) => sum + item.amount, 0),
        usageByOperation,
        usageByDay,
        recentActivity: usageHistory.slice(0, 10), // Последние 10 операций
      }
    });
    
  } catch (error) {
    console.error('Error fetching credit analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'Failed to fetch credit analytics',
          details: error instanceof Error ? error.message : String(error)
        } 
      },
      { status: 500 }
    );
  }
} 