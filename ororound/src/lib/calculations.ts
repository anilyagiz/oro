export function roundUp(
  amount: number,
  increment: 1 | 5 | 10
): { roundedAmount: number; difference: number } {
  if (amount < 0) {
    throw new Error('Amount must be non-negative');
  }

  if (amount === 0) {
    return { roundedAmount: 0, difference: 0 };
  }

  const roundedAmount = Math.ceil(amount / increment) * increment;
  const difference = roundedAmount - amount;

  const roundedDifference = Math.round(difference * 100) / 100;

  return {
    roundedAmount,
    difference: roundedDifference,
  };
}

export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatGold(amount: number): string {
  return `${amount.toFixed(6)} GOLD`;
}
