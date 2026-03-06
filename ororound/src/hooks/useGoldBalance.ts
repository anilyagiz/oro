'use client';

import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getSolanaConnection } from '@/lib/solana-connection';

const GOLD_MINT_ADDRESS = process.env.NEXT_PUBLIC_GOLD_MINT;

function isValidPublicKey(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  try {
    new PublicKey(value);
    return true;
  } catch (error) {
    console.warn('Invalid public key format:', value, error);
    return false;
  }
}

async function getTokenBalance(
  walletAddress: string,
  mintAddress: string
): Promise<number> {
  try {
    // Use singleton connection instead of creating new one each time
    const connection = getSolanaConnection();
    
    const walletPubkey = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(mintAddress);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubkey, {
      mint: mintPubkey,
    });

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance || 0;
  } catch (error) {
    console.error('Failed to fetch token balance:', { walletAddress, mintAddress, error });
    return 0;
  }
}

export function useGoldBalance() {
  const { publicKey, connected } = useWallet();

  return useQuery({
    queryKey: ['goldBalance', publicKey?.toBase58()],
    queryFn: async (): Promise<number> => {
      if (!publicKey) return 0;
      if (!isValidPublicKey(GOLD_MINT_ADDRESS)) return 0;

      return getTokenBalance(publicKey.toBase58(), GOLD_MINT_ADDRESS);
    },
    enabled: connected && !!publicKey,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}