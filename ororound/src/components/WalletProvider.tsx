'use client';

import { FC, ReactNode, useMemo, useCallback, useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletError } from '@solana/wallet-adapter-base';
import { useWalletStore } from '@/store/walletStore';

import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

/**
 * Syncs @solana/wallet-adapter-react state → Zustand walletStore.
 * Must be rendered inside SolanaWalletProvider.
 */
function WalletStateSync() {
  const { publicKey, connected, connecting } = useWallet();
  const { setPublicKey, setConnected, setConnecting } = useWalletStore();

  useEffect(() => {
    setConnected(connected);
    setConnecting(connecting);
    setPublicKey(publicKey ? publicKey.toBase58() : null);
  }, [connected, connecting, publicKey, setConnected, setConnecting, setPublicKey]);

  return null;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'),
    []
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    if (error.name === 'WalletNotReadyError' || error.name === 'WalletNotInstalledError') {
      return;
    }
    console.warn('Wallet connection issue:', error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={true} onError={onError}>
        <WalletModalProvider>
          <WalletStateSync />
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
