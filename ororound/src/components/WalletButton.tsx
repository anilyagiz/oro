'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut } from 'lucide-react';

interface Props {
  className?: string;
}

export const WalletButton: FC<Props> = ({ className }) => {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  if (!mounted) {
    return (
      <Button disabled className={className} variant="default">
        Select Wallet
      </Button>
    );
  }

  // If connected, show dropdown to disconnect
  if (connected && wallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`gap-2 ${className}`}>
            {wallet.adapter.icon && (
              <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="h-4 w-4" />
            )}
            {displayAddress}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => disconnect()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If not connected, open the standard Solana wallet modal
  return (
    <Button
      disabled={connecting}
      className={className}
      variant="default"
      onClick={() => setVisible(true)}
    >
      {connecting ? 'Connecting...' : 'Select Wallet'}
    </Button>
  );
};
