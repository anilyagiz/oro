'use client';

import { Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatUSDC } from '@/lib/calculations';

interface BalanceDisplayProps {
  goldBalance: number;
  totalInvested: number;
  avgEntryPrice: number;
  isLoading?: boolean;
}

export function BalanceDisplay({
  goldBalance,
  totalInvested,
  avgEntryPrice,
  isLoading,
}: BalanceDisplayProps) {
  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-amber-50/50 dark:to-amber-950/10">
      <CardHeader className="border-b bg-muted/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl">Your GOLD Balance</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Holdings</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {isLoading ? '---' : goldBalance.toFixed(6)}
              </span>
              <span className="text-lg font-semibold text-amber-500">GOLD</span>
            </div>
          </div>

          <div className="flex gap-6 sm:text-right">
            <div className="space-y-1">
              <span className="block text-sm font-medium text-muted-foreground">
                Total Invested
              </span>
              <span className="block text-lg font-bold">
                {isLoading ? '---' : formatUSDC(totalInvested)}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-sm font-medium text-muted-foreground">
                Avg. Entry Price
              </span>
              <span className="block text-lg font-bold">
                {isLoading || goldBalance === 0 ? '---' : formatUSDC(avgEntryPrice)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
