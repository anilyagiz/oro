'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { WalletModal } from './WalletModal';

interface Props {
  className?: string;
}

export const WalletButton: FC<Props> = ({ className }) => {
  const { publicKey, wallet, disconnect, connecting, connected, connect } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-connect when wallet is selected
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch((err) => {
        console.warn('Auto-connect failed:', err.message);
      });
    }
  }, [wallet, connected, connecting, connect]);

  const displayAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  if (!mounted) {
    return (
      <Button disabled className={className} variant="default">
        <Wallet className="mr-2 h-4 w-4" />
        Connect
      </Button>
    );
  }

  // If connected, show dropdown to disconnect
  if (connected && wallet && publicKey) {
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
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{wallet.adapter.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {publicKey.toBase58()}
              </p>
            </div>
          </DropdownMenuLabel>
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

  // If not connected, show connect button that opens modal
  return (
    <>
      <Button
        disabled={connecting}
        className={className}
        variant="default"
        onClick={() => setIsModalOpen(true)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
