import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders correctly', () => {
    render(
      <EmptyState
        title="No items found"
        description="Try adding some items"
        icon={<div>Icon</div>}
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('renders action button and handles clicks', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        description="Empty description"
        icon={<div />}
        actionLabel="Click me"
        onAction={onAction}
      />
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalled();
  });
});
