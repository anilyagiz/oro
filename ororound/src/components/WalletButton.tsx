'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
}

export const WalletButton: FC<Props> = ({ className }) => {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const displayAddress = publicKey 
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <Button 
      onClick={handleClick} 
      disabled={connecting}
      className={className}
      variant={connected ? 'outline' : 'default'}
    >
      {connecting && 'Connecting...'}
      {!connecting && !connected && 'Select Wallet'}
      {!connecting && connected && wallet && (
        <span className="flex items-center gap-2">
          {wallet.adapter.icon && (
            <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="h-4 w-4" />
          )}
          {displayAddress}
        </span>
      )}
    </Button>
  );
};
