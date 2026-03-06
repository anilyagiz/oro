'use client';

import * as React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatGold, formatUSDC } from '@/lib/calculations';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  goldAmount: number;
  usdcAmount: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  txHash,
  goldAmount,
  usdcAmount,
}: SuccessModalProps) {
  const explorerUrl = txHash
    ? `https://explorer.solana.com/tx/${txHash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'mainnet' : 'devnet'}`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 sm:text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-xl">Purchase Successful</DialogTitle>
          <DialogDescription className="text-center">
            You successfully purchased tokenized gold.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Amount Invested</span>
              <span className="text-lg font-bold">{formatUSDC(usdcAmount)}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-sm font-medium text-muted-foreground">GOLD Received</span>
              <span className="text-lg font-bold text-amber-500">{formatGold(goldAmount)}</span>
            </div>
          </div>

          {txHash && (
            <div className="flex flex-col gap-2 rounded-lg bg-muted p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transaction</span>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} className="w-full sm:w-auto">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
