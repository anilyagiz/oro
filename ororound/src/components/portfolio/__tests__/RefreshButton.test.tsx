import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RefreshButton } from '../RefreshButton';

describe('RefreshButton', () => {
  it('renders correctly', () => {
    render(<RefreshButton onRefresh={() => {}} isRefreshing={false} />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('shows loading state when refreshing', () => {
    render(<RefreshButton onRefresh={() => {}} isRefreshing={true} />);
    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
  });

  it('calls onRefresh when clicked', () => {
    const onRefresh = vi.fn();
    render(<RefreshButton onRefresh={onRefresh} isRefreshing={false} />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalled();
  });
});
