'use client';

import { useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TransactionList, BalanceDisplay, EmptyState, RefreshButton } from '@/components/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DevnetBanner } from '@/components/ui/DevnetBanner';
import { useCreateUser, useTransactions, type GrailTransaction } from '@/hooks/useGrail';
import { useGoldBalance } from '@/hooks/useGoldBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, TrendingUp, Wallet } from 'lucide-react';
import { formatUSDC } from '@/lib/calculations';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet();
  const { grailUserId } = useUserStore();
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const createAttemptRef = useRef<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey || grailUserId) {
      return;
    }

    const walletAddress = publicKey.toBase58();
    if (createAttemptRef.current === walletAddress) {
      return;
    }

    createAttemptRef.current = walletAddress;
    createUserMutation.mutate(walletAddress, {
      onError: () => {
        createAttemptRef.current = null;
      },
    });
  }, [connected, publicKey, grailUserId, createUserMutation]);

  const goldBalanceQuery = useGoldBalance();
  const transactionsQuery = useTransactions();

  const handleRefresh = async () => {
    await Promise.all([goldBalanceQuery.refetch(), transactionsQuery.refetch()]);
  };

  const isRefreshing = goldBalanceQuery.isFetching || transactionsQuery.isFetching;
  const transactions: GrailTransaction[] = transactionsQuery.data ?? [];
  const completed = transactions.filter((item: GrailTransaction) => item.status === 'confirmed');

  const totalInvested = completed.reduce((sum: number, item: GrailTransaction) => sum + item.usdcAmount, 0);
  const totalGoldBought = completed.reduce((sum: number, item: GrailTransaction) => sum + item.goldAmount, 0);
  const walletGoldBalance = goldBalanceQuery.data ?? 0;
  const usedGoldBalance = walletGoldBalance > 0 ? walletGoldBalance : totalGoldBought;

  const avgEntryPrice = usedGoldBalance > 0 ? totalInvested / usedGoldBalance : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
              <p className="mt-2 text-muted-foreground">
                Track your GOLD holdings and completed purchases.
              </p>
            </div>
            {connected && <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />}
          </div>

          {!connected ? (
            <Card>
              <CardContent className="py-6">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet from the header to load your portfolio.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <BalanceDisplay
                goldBalance={usedGoldBalance}
                totalInvested={totalInvested}
                avgEntryPrice={avgEntryPrice}
                isLoading={isRefreshing}
              />

              {transactions.length > 0 ? (
                <TransactionList
                  transactions={transactions}
                  isLoading={transactionsQuery.isLoading}
                  error={transactionsQuery.error ?? null}
                />
              ) : (
                <EmptyState
                  title="No transactions yet"
                  description="Your portfolio is empty. Start by investing your spare change into tokenized gold."
                  actionLabel="Buy Gold Now"
                  onAction={() => router.push('/')}
                  icon={<Wallet className="h-8 w-8" />}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
