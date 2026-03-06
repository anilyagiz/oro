import { useQuery, useMutation } from '@tanstack/react-query';
import { OroTradeBookApi } from '../lib/api/oro';

// NOTE: In production, do NOT hardcode the API key in the client side.
// Instead, proxy requests through your own backend.
const oroApi = new OroTradeBookApi(import.meta.env.VITE_ORO_API_KEY || 'dummy_key');

// --- QUERIES ---

export function useOroHealth() {
  return useQuery({
    queryKey: ['oro', 'health'],
    queryFn: () => oroApi.checkHealth(),
  });
}

export function useGoldPrice() {
  return useQuery({
    queryKey: ['oro', 'goldPrice'],
    queryFn: () => oroApi.getGoldPrice(),
    refetchInterval: 60000, // Refetch every 1 minute
  });
}

export function useEstimateBuy(goldAmount: number) {
  return useQuery({
    queryKey: ['oro', 'estimateBuy', goldAmount],
    queryFn: () => oroApi.estimateBuy(goldAmount),
    enabled: goldAmount > 0,
  });
}

export function useEstimateSell(goldAmount: number) {
  return useQuery({
    queryKey: ['oro', 'estimateSell', goldAmount],
    queryFn: () => oroApi.estimateSell(goldAmount),
    enabled: goldAmount > 0,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['oro', 'user', userId],
    queryFn: () => oroApi.getUser(userId),
    enabled: !!userId,
  });
}

export function useUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['oro', 'users', page, limit],
    queryFn: () => oroApi.listUsers(page, limit),
  });
}

// --- MUTATIONS ---

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: (data: { kycHash: string; userWalletAddress?: string; metadata?: any }) =>
      oroApi.createUser(data.kycHash, data.userWalletAddress, data.metadata),
  });
}

export function usePurchaseGoldMutation() {
  return useMutation({
    mutationFn: (data: { userId: string; goldAmount: number; maxUsdcAmount: number }) =>
      oroApi.purchaseGoldForUser(data.userId, data.goldAmount, data.maxUsdcAmount),
  });
}

export function useSellGoldMutation() {
  return useMutation({
    mutationFn: (data: { userId: string; goldAmount: number; minimumUsdcAmount: number }) =>
      oroApi.sellGoldForUser(data.userId, data.goldAmount, data.minimumUsdcAmount),
  });
}

export function useSubmitTransactionMutation() {
  return useMutation({
    mutationFn: (data: { txId: string; signedSerializedTx: string }) =>
      oroApi.submitTransaction(data.txId, data.signedSerializedTx),
  });
}
