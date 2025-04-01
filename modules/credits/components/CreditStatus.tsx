import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatResetDate, isLowOnCredits } from '@/modules/credits/utils';
import { CreditStatus as CreditStatusEnum } from '@/modules/credits/types';

interface CreditStatusProps {
  total: number;
  used: number;
  resetDate?: Date;
  status: CreditStatusEnum;
}

export function CreditStatus({ 
  total, 
  used, 
  resetDate,
  status = CreditStatusEnum.ACTIVE 
}: CreditStatusProps) {
  const remaining = total - used;
  const percentUsed = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const isLow = isLowOnCredits(total, used);
  const resetDateFormatted = resetDate ? formatResetDate(resetDate) : null;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Credit Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {remaining} / {total} credits remaining
              </p>
              {resetDateFormatted && (
                <p className="text-xs text-muted-foreground">
                  Resets: {resetDateFormatted}
                </p>
              )}
            </div>
            
            <StatusBadge status={status} isLow={isLow} />
          </div>
          
          <Progress 
            value={percentUsed} 
            className={`h-2 ${isLow ? 'bg-amber-100' : ''}`}
            indicatorClassName={isLow ? 'bg-amber-500' : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, isLow }: { status: CreditStatusEnum, isLow: boolean }) {
  const getStatusConfig = () => {
    switch (status) {
      case CreditStatusEnum.ACTIVE:
        return isLow 
          ? { text: 'Low', className: 'bg-amber-100 text-amber-700 border-amber-200' }
          : { text: 'Active', className: 'bg-green-100 text-green-700 border-green-200' };
      case CreditStatusEnum.EXHAUSTED:
        return { text: 'Exhausted', className: 'bg-red-100 text-red-700 border-red-200' };
      case CreditStatusEnum.INACTIVE:
        return { text: 'Inactive', className: 'bg-gray-100 text-gray-700 border-gray-200' };
      case CreditStatusEnum.SUSPENDED:
        return { text: 'Suspended', className: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };
  
  const { text, className } = getStatusConfig();
  
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${className}`}>
      {text}
    </span>
  );
} 