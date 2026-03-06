'use client';

import * as React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  onRetry?: () => void;
}

export function FailureModal({ isOpen, onClose, error, onRetry }: FailureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 sm:text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl">Purchase Failed</DialogTitle>
          <DialogDescription className="text-center">
            We couldn&apos;t complete your gold purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">Error details:</span>
              <span className="opacity-90">{error || 'An unknown error occurred.'}</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            No funds were deducted from your wallet. Please check your connection and try again.
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          {onRetry && (
            <Button type="button" onClick={onRetry} className="w-full sm:w-auto">
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
