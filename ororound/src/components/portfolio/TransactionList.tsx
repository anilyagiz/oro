import React, { memo } from 'react';
import { CheckCircle2, Clock, Wallet, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GrailTransaction } from '@/hooks/useGrail';
import { formatGold, formatUSDC } from '@/lib/calculations';

interface TransactionListProps {
  transactions?: GrailTransaction[];
  isLoading: boolean;
  error: Error | null;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

// Memoized StatusBadge component to prevent unnecessary re-renders
const StatusBadge = memo(function StatusBadge({ status }: { status: GrailTransaction['status'] }) {
  const tone = {
    confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    processing: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  const icon = {
    confirmed: CheckCircle2,
    pending: Clock,
    processing: Clock,
    failed: XCircle,
  };

  const label = {
    confirmed: 'Completed',
    pending: 'Pending',
    processing: 'Processing',
    failed: 'Failed',
  };

  const Icon = icon[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label[status]}
    </span>
  );
});

// Memoized TransactionItem component to prevent unnecessary re-renders
const TransactionItem = memo(function TransactionItem({ transaction }: { transaction: GrailTransaction }) {
  return (
    <div className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-muted/50">
      <div>
        <p className="font-medium text-foreground">{formatUSDC(transaction.usdcAmount)} USDC</p>
        <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-medium text-foreground">{formatGold(transaction.goldAmount)}</span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  );
});

export function TransactionList({ transactions, isLoading, error }: TransactionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest GOLD purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest GOLD purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest GOLD purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 rounded-full bg-muted p-4">
              <Wallet className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest GOLD purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.transactionId} transaction={transaction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionList;