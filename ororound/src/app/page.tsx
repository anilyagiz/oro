'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DevnetBanner } from '@/components/ui/DevnetBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AmountInput,
  RoundUpSelector,
  TransactionPreview,
  SuccessModal,
  FailureModal,
} from '@/components/purchase';
import { useCreateUser, useGoldQuote, usePurchaseGold, useTransactionStatus } from '@/hooks';
import { useUIStore } from '@/store';
import { useUserStore } from '@/store/userStore';
import { formatUSDC, roundUp } from '@/lib/calculations';
import {
  savePendingTransaction,
  getPendingTransaction,
  clearPendingTransaction,
} from '@/lib/transaction-persistence';
import { mapGrailError } from '@/lib/errors';
import { useDebounce } from '@/hooks/useDebounce';
import axios from 'axios';

const QUOTE_DEBOUNCE_DELAY = 500;

export default function Home() {
  const { connected, publicKey } = useWallet();
  const { roundUpAmount, setRoundUpAmount } = useUIStore();
  const { grailUserId } = useUserStore();

  const [amount, setAmount] = useState('');
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const createAttemptRef = useRef<string | null>(null);

  const createUserMutation = useCreateUser();
  const purchaseMutation = usePurchaseGold();

  const debouncedAmount = useDebounce(amount, QUOTE_DEBOUNCE_DELAY);

  const parsedAmount = Number.parseFloat(debouncedAmount);
  const spendAmount = Number.isFinite(Number.parseFloat(amount)) ? Number.parseFloat(amount) : 0;

  const calc = useMemo(() => {
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !isAmountValid) {
      return { roundedAmount: 0, difference: 0 };
    }
    return roundUp(parsedAmount, roundUpAmount);
  }, [parsedAmount, roundUpAmount, isAmountValid]);

  const shouldGetQuote = connected && !!grailUserId && isAmountValid && calc.difference > 0;
  const quoteQuery = useGoldQuote(calc.difference, shouldGetQuote);
  const txStatusQuery = useTransactionStatus(activeTransactionId);

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

  useEffect(() => {
    const pendingTxId = getPendingTransaction();
    if (pendingTxId) {
      setActiveTransactionId(pendingTxId);
    }
  }, []);

  useEffect(() => {
    if (!txStatusQuery.data) return;

    if (txStatusQuery.data.status === 'confirmed') {
      setIsSuccessModalOpen(true);
      clearPendingTransaction();
      setActiveTransactionId(null);
    } else if (txStatusQuery.data.status === 'failed') {
      setPurchaseError(mapGrailError('TRANSACTION_FAILED'));
      setIsFailureModalOpen(true);
      clearPendingTransaction();
      setActiveTransactionId(null);
    }
  }, [txStatusQuery.data]);

  const canPurchase =
    connected &&
    !!grailUserId &&
    isAmountValid &&
    calc.difference > 0 &&
    !!quoteQuery.data &&
    !purchaseMutation.isPending &&
    !activeTransactionId;

  const handleBuyGold = useCallback(async () => {
    if (!quoteQuery.data) return;

    try {
      const result = await purchaseMutation.mutateAsync({
        goldAmount: quoteQuery.data.goldAmount,
        maxUsdcAmount: quoteQuery.data.usdcAmount,
      });

      if (result.transaction) {
        setActiveTransactionId(result.transaction.txId);
        savePendingTransaction(result.transaction.txId);
      }
    } catch (err: unknown) {
      const errorCode = axios.isAxiosError(err)
        ? err.response?.data?.error || 'PURCHASE_ERROR'
        : 'PURCHASE_ERROR';
      setPurchaseError(mapGrailError(errorCode));
      setIsFailureModalOpen(true);
    }
  }, [quoteQuery.data, purchaseMutation]);

  return (
    <div className="flex min-h-screen flex-col">
      <DevnetBanner />
      <Header />

      <main className="flex-1 px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
          <section className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Spare Change to GOLD
              </h1>
              <p className="mt-2 text-muted-foreground">
                Enter a spend amount, round it up, and invest the difference in tokenized gold.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>1) Enter Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountInput value={amount} onChange={setAmount} onValidate={setIsAmountValid} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2) Select Round-up Rule</CardTitle>
              </CardHeader>
              <CardContent>
                <RoundUpSelector value={roundUpAmount} onChange={setRoundUpAmount} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3) Buy GOLD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleBuyGold} disabled={!canPurchase}>
                  Buy GOLD with {formatUSDC(calc.difference)}
                </Button>

                {!connected && (
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet from the header first.
                  </p>
                )}
                {createUserMutation.isPending && (
                  <p className="text-sm text-muted-foreground">
                    Creating your GRAIL user profile...
                  </p>
                )}
                {quoteQuery.isLoading && shouldGetQuote && (
                  <p className="text-sm text-muted-foreground">Fetching live quote...</p>
                )}
                {createUserMutation.error && (
                  <p className="text-sm text-destructive">{createUserMutation.error.message}</p>
                )}
                {quoteQuery.error && (
                  <p className="text-sm text-destructive">{quoteQuery.error.message}</p>
                )}
                {purchaseMutation.error && (
                  <p className="text-sm text-destructive">{purchaseMutation.error.message}</p>
                )}

                {txStatusQuery.data && (
                  <p className="text-sm text-muted-foreground">
                    Transaction status:{' '}
                    <span className="font-medium">{txStatusQuery.data.status}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <TransactionPreview
              spendAmount={spendAmount}
              roundedAmount={calc.roundedAmount}
              contribution={calc.difference}
              quote={quoteQuery.data}
              isLoading={quoteQuery.isLoading && shouldGetQuote}
            />

            <Card>
              <CardHeader>
                <CardTitle>Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. You enter your spend amount.</p>
                <p>2. OroRound calculates your spare change based on your round-up setting.</p>
                <p>3. GRAIL returns a live quote and creates a purchase transaction.</p>
                <p>4. Your wallet remains self-custodial throughout the process.</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        txHash={txStatusQuery.data?.signature}
        goldAmount={txStatusQuery.data?.goldAmount || 0}
        usdcAmount={txStatusQuery.data?.usdcAmount || calc.difference}
      />
      <FailureModal
        isOpen={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        error={purchaseError}
      />
    </div>
  );
}
