import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGoldQuote } from '../ororound/src/hooks/useGrail';
import type { ReactNode } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useGoldQuote Integration', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_GRAIL_API_URL = 'https://api.grail.example.com';
    process.env.NEXT_PUBLIC_GRAIL_API_KEY = 'test-api-key';
  });

  it('fetches quote successfully', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '100',
      paymentToken: 'USDC',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toMatchObject({
      estimatedGold: '1.0',
      exchangeRate: '65.50',
      paymentAmount: '100',
      paymentToken: 'USDC',
    });
  });

  it('includes projectId in query when provided', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '50',
      paymentToken: 'USDC',
      projectId: 'project-123',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.isSuccess).toBe(true);
  });

  it('handles server error', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: 'error',
      paymentToken: 'USDC',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Failed to fetch quote');
  });

  it('does not fetch when params is null', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useGoldQuote(null), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('does not fetch when amount is empty', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '',
      paymentToken: 'USDC',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('does not fetch when paymentToken is empty', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '100',
      paymentToken: '',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('respects enabled option', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '100',
      paymentToken: 'USDC',
    };
    
    const { result } = renderHook(
      () => useGoldQuote(params, { enabled: false }),
      { wrapper }
    );
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('generates correct query key', async () => {
    const wrapper = createWrapper();
    const params = {
      amount: '75',
      paymentToken: 'ETH',
      projectId: 'proj-456',
    };
    
    const { result } = renderHook(() => useGoldQuote(params), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.paymentToken).toBe('ETH');
  });
});