'use client';

import { FC, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select, connecting } = useWallet();

  const handleWalletSelect = useCallback(
    async (walletName: WalletName) => {
      try {
        select(walletName);
        onClose();
      } catch (error) {
        console.error('Wallet selection failed:', error);
      }
    },
    [select, onClose]
  );

  const installedWallets = wallets.filter(
    (wallet) => wallet.readyState === 'Installed'
  );

  const otherWallets = wallets.filter(
    (wallet) => wallet.readyState !== 'Installed'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Select a wallet to connect to OroRound
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          {installedWallets.length > 0 && (
            <>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Detected Wallets
              </p>
              {installedWallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  disabled={connecting}
                >
                  {wallet.adapter.icon && (
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="h-6 w-6"
                    />
                  )}
                  <span className="font-medium">{wallet.adapter.name}</span>
                  <span className="ml-auto text-xs text-emerald-500">Installed</span>
                </Button>
              ))}
            </>
          )}

          {installedWallets.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                No wallet detected. Please install one of the following:
              </p>
            </div>
          )}

          {otherWallets.length > 0 && (
            <>
              <p className="text-sm font-medium text-muted-foreground mt-4 mb-2">
                {installedWallets.length > 0 ? 'Other Wallets' : 'Available Wallets'}
              </p>
              {otherWallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => {
                    if (wallet.adapter.url) {
                      window.open(wallet.adapter.url, '_blank');
                    }
                  }}
                >
                  {wallet.adapter.icon && (
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="h-6 w-6 opacity-50"
                    />
                  )}
                  <span className="font-medium text-muted-foreground">
                    {wallet.adapter.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Install →
                  </span>
                </Button>
              ))}
            </>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          By connecting, you agree to our Terms of Service
        </div>
      </DialogContent>
    </Dialog>
  );
};
