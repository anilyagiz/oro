import { useQuery } from '@tanstack/react-query';
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';

export interface UseGoldBalanceOptions {
  connection: Connection;
  walletAddress: string | PublicKey | null | undefined;
  mintAddress: string | PublicKey;
  refetchInterval?: number;
  enabled?: boolean;
}

export interface GoldBalanceResult {
  rawBalance: bigint;
  formattedBalance: string;
  balanceNumber: number;
  ataAddress: string | null;
  ataExists: boolean;
  decimals: number;
}

const DEFAULT_REFETCH_INTERVAL = 10000;
const DISPLAY_DECIMALS = 4;

export function useGoldBalance({
  connection,
  walletAddress,
  mintAddress,
  refetchInterval = DEFAULT_REFETCH_INTERVAL,
  enabled = true,
}: UseGoldBalanceOptions) {
  return useQuery<GoldBalanceResult, Error>({
    queryKey: ['gold-balance', walletAddress?.toString(), mintAddress.toString()],
    queryFn: async (): Promise<GoldBalanceResult> => {
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }

      const walletPubkey = typeof walletAddress === 'string' 
        ? new PublicKey(walletAddress) 
        : walletAddress;
      
      const mintPubkey = typeof mintAddress === 'string' 
        ? new PublicKey(mintAddress) 
        : mintAddress;

      const ata = await getAssociatedTokenAddress(
        mintPubkey,
        walletPubkey,
        false,
        TOKEN_PROGRAM_ID
      );

      try {
        const accountInfo = await getAccount(connection, ata);
        
        const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
        const decimals = (mintInfo.value?.data as { parsed?: { info?: { decimals?: number } } })?.parsed?.info?.decimals ?? 9;
        
        const rawBalance = accountInfo.amount;
        
        const balanceWithDecimals = Number(rawBalance) / Math.pow(10, decimals);
        
        const balanceNumber = Math.round(balanceWithDecimals * Math.pow(10, DISPLAY_DECIMALS)) / Math.pow(10, DISPLAY_DECIMALS);
        
        const formattedBalance = balanceNumber.toFixed(DISPLAY_DECIMALS);

        return {
          rawBalance,
          formattedBalance,
          balanceNumber,
          ataAddress: ata.toBase58(),
          ataExists: true,
          decimals,
        };
      } catch {
        const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
        const decimals = (mintInfo.value?.data as { parsed?: { info?: { decimals?: number } } })?.parsed?.info?.decimals ?? 9;
        
        return {
          rawBalance: BigInt(0),
          formattedBalance: (0).toFixed(DISPLAY_DECIMALS),
          balanceNumber: 0,
          ataAddress: ata.toBase58(),
          ataExists: false,
          decimals,
        };
      }
    },
    refetchInterval,
    enabled: enabled && !!walletAddress,
    staleTime: refetchInterval / 2,
  });
}

export default useGoldBalance;
