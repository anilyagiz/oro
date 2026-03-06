import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SuccessModal } from '../SuccessModal';

describe('SuccessModal', () => {
  it('renders correctly when open', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={() => {}}
        goldAmount={1.5}
        usdcAmount={100}
        txHash="1234567890abcdef"
      />
    );

    expect(screen.getByText('Purchase Successful')).toBeInTheDocument();
    expect(screen.getByText('Amount Invested')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('1.500000 GOLD')).toBeInTheDocument();
    expect(screen.getByText('View on Explorer')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SuccessModal isOpen={false} onClose={() => {}} goldAmount={1.5} usdcAmount={100} />);

    expect(screen.queryByText('Purchase Successful')).not.toBeInTheDocument();
  });
});
