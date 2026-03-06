import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatGold, formatUSDC } from '@/lib/calculations';
import type { GrailQuote } from '@/hooks/useGrail';

interface TransactionPreviewProps {
  spendAmount: number;
  roundedAmount: number;
  contribution: number;
  quote?: GrailQuote;
  isLoading?: boolean;
}

export function TransactionPreview({
  spendAmount,
  roundedAmount,
  contribution,
  quote,
  isLoading,
}: TransactionPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Original spend</span>
          <span className="font-medium">{formatUSDC(spendAmount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Rounded total</span>
          <span className="font-medium">{formatUSDC(roundedAmount)}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <span>Round-up contribution</span>
          <span className="font-semibold">{formatUSDC(contribution)}</span>
        </div>

        {isLoading && <p className="text-muted-foreground">Getting live GOLD quote...</p>}

        {quote && (
          <>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated GOLD</span>
              <span className="font-semibold">{formatGold(quote.goldAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gold price (oz)</span>
              <span>{formatUSDC(quote.goldPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span>{formatUSDC(quote.fee)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
