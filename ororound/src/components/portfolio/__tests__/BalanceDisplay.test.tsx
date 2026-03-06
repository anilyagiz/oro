import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BalanceDisplay } from '../BalanceDisplay';

describe('BalanceDisplay', () => {
  it('renders balance correctly', () => {
    render(<BalanceDisplay goldBalance={2.5} totalInvested={500} avgEntryPrice={200} />);

    expect(screen.getByText('2.500000')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<BalanceDisplay goldBalance={0} totalInvested={0} avgEntryPrice={0} isLoading={true} />);

    const loadingIndicators = screen.getAllByText('---');
    expect(loadingIndicators.length).toBeGreaterThan(0);
  });
});
