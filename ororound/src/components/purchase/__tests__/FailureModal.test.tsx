import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FailureModal } from '../FailureModal';

describe('FailureModal', () => {
  it('renders correctly when open', () => {
    render(<FailureModal isOpen={true} onClose={() => {}} error="Insufficient funds" />);

    expect(screen.getByText('Purchase Failed')).toBeInTheDocument();
    expect(screen.getByText('Error details:')).toBeInTheDocument();
    expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
  });

  it('calls onRetry when Try Again is clicked', () => {
    const onRetry = vi.fn();
    render(
      <FailureModal isOpen={true} onClose={() => {}} error="Network error" onRetry={onRetry} />
    );

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });
});
