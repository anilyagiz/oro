'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { completeTransactionFlow } from '@/lib/transaction';
import { VersionedTransaction } from '@solana/web3.js';

// ─── Types ───
export interface GrailUser {
  userId: string;
  userPda: string;
  kycHash: string;
  userWalletAddress?: string;
  metadata?: {
    tags?: string[];
    referenceId?: string;
  };
  balancesManagedByProgram?: {
    gold: {
      valueUsd: number;
      amount: number;
    };
  };
  createdAt: string;
  updatedAt?: string;
  transaction?: {
    txId: string;
    serializedTx: string;
    signingInstructions: {
      walletType: string;
      signers?: string[];
      expiresAt: string;
    };
  };
}

export interface GrailQuote {
  quoteId: string;
  goldAmount: number;
  goldPrice: number;
  usdcAmount: number;
  fee: number;
  expiresAt: string;
}

export interface GrailPurchase {
  purchaseId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction: {
    txId: string;
    serializedTx: string;
    signingInstructions: {
      walletType: string;
      signers?: string[];
      expiresAt: string;
    };
  };
  goldAmount: number;
  usdcAmount: number;
  createdAt: string;
}

export interface GrailTransaction {
  transactionId: string;
  signature?: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  goldAmount: number;
  usdcAmount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── User Management ───
export function useCreateUser() {
  const { setKycHash, setGrailUserId, setCreatedAt } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string): Promise<GrailUser> => {
      // Use wallet address directly as kycHash (Grail expects base58 format)
      const kycHash = walletAddress;

      const response = await fetch('/api/oro/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycHash, userWalletAddress: walletAddress }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      const data = await response.json();
      const user = data.data;

      setKycHash(kycHash);
      setGrailUserId(user.userId);
      setCreatedAt(user.createdAt);

      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUser(userId?: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<GrailUser> => {
      if (!userId) throw new Error('userId is required');

      const response = await fetch(`/api/oro/users/${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}


export function useGoldPrice() {
  return useQuery({
    queryKey: ['goldPrice'],
    queryFn: async () => {
      const response = await fetch('/api/oro/trading/price');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get gold price');
      }
      const data = await response.json();
      return data.data;
    },
    refetchInterval: 60 * 1000,
  });
}

export function useGoldQuote(paymentAmount: number, enabled: boolean = true) {
  const { grailUserId } = useUserStore();

  return useQuery({
    queryKey: ['quote', grailUserId, paymentAmount],
    queryFn: async (): Promise<GrailQuote> => {
      if (!grailUserId) throw new Error('User not initialized');

      const response = await fetch(
        `/api/oro/trading/estimate-buy?goldAmount=${paymentAmount}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get quote');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: enabled && !!grailUserId && paymentAmount > 0,
    staleTime: 10 * 1000,
  });
}


export function usePurchaseGold() {
  const { grailUserId } = useUserStore();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      goldAmount: number;
      maxUsdcAmount: number;
    }): Promise<GrailPurchase & { signature?: string }> => {
      if (!grailUserId) {
        throw new Error('User not initialized');
      }

      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }


      const response = await fetch('/api/oro/trading/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: grailUserId,
          goldAmount: params.goldAmount,
          maxUsdcAmount: params.maxUsdcAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create purchase');
      }

      const data = await response.json();
      const purchase = data.data;


      if (purchase.transaction) {
        const result = await completeTransactionFlow(
          purchase.transaction.serializedTx,
          async (tx: VersionedTransaction) => {
            const signed = await signTransaction(tx);
            return signed;
          },
          connection,
          purchase.transaction.txId,
          async (txId, signedSerializedTx) => {

            await fetch('/api/oro/transactions/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txId, signedSerializedTx }),
            });
          }
        );

        return {
          ...purchase,
          signature: result.signature,
        };
      }

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}


export function useSellGold() {
  const { grailUserId } = useUserStore();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      goldAmount: number;
      minimumUsdcAmount: number;
    }) => {
      if (!grailUserId) {
        throw new Error('User not initialized');
      }

      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      const response = await fetch('/api/oro/trading/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: grailUserId,
          goldAmount: params.goldAmount,
          minimumUsdcAmount: params.minimumUsdcAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create sell order');
      }

      const data = await response.json();
      const sellData = data.data;


      if (sellData.transaction) {
        const result = await completeTransactionFlow(
          sellData.transaction.serializedTx,
          async (tx: VersionedTransaction) => {
            const signed = await signTransaction(tx);
            return signed;
          },
          connection,
          sellData.transaction.txId,
          async (txId, signedSerializedTx) => {
            await fetch('/api/oro/transactions/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txId, signedSerializedTx }),
            });
          }
        );

        return {
          ...sellData,
          signature: result.signature,
        };
      }

      return sellData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}


export function useTransactionStatus(transactionId: string | null) {
  const { grailUserId } = useUserStore();

  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async (): Promise<GrailTransaction> => {
      if (!grailUserId || !transactionId) {
        throw new Error('User ID or transaction ID missing');
      }

      // Note: You may need to add a GET /api/oro/transactions/:id endpoint
      // For now, we'll use the user's transactions list
      const response = await fetch(`/api/oro/users/${grailUserId}/transactions`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get transactions');
      }

      const data = await response.json();
      const transactions = data.data || [];
      const tx = transactions.find((t: any) => t.transactionId === transactionId);

      if (!tx) {
        throw new Error('Transaction not found');
      }

      return tx;
    },
    enabled: !!grailUserId && !!transactionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'confirmed' || data.status === 'failed')) {
        return false;
      }
      return 2000;
    },
  });
}


export function useTransactions() {
  const { grailUserId } = useUserStore();

  return useQuery({
    queryKey: ['transactions', grailUserId],
    queryFn: async () => {
      if (!grailUserId) return [];

      const response = await fetch(`/api/oro/users/${grailUserId}/transactions`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get transactions');
      }

      const data = await response.json();
      return data.data || [];
    },
    enabled: !!grailUserId,
    staleTime: 60 * 1000,
  });
}

