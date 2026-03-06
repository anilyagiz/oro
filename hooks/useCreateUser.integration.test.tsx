import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUser } from '../ororound/src/hooks/useGrail';
import type { ReactNode } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
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

describe('useCreateUser Integration', () => {
  it('creates user successfully', async () => {
    const onSuccess = vi.fn();
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCreateUser({ onSuccess }), { wrapper });
    
    result.current.createUser('0xNEWUSER123');
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toMatchObject({
      userId: 'user-123',
      walletAddress: '0xNEWUSER123',
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles user already exists (409) without calling onError', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const wrapper = createWrapper();
    
    const { result } = renderHook(
      () => useCreateUser({ onSuccess, onError }),
      { wrapper }
    );
    
    result.current.createUser('0xDUPLICATE');
    
    await waitFor(() => expect(result.current.isPending).toBe(false));
    
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles server error (500) and calls onError', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const wrapper = createWrapper();
    
    const { result } = renderHook(
      () => useCreateUser({ onSuccess, onError }),
      { wrapper }
    );
    
    result.current.createUser('0xERROR');
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(onError).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeDefined();
  });

  it('exposes correct loading states', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCreateUser(), { wrapper });
    
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    
    result.current.createUser('0xNEWUSER456');
    
    await waitFor(() => expect(result.current.isPending).toBe(true));
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it('exposes createUserAsync for promise-based usage', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCreateUser(), { wrapper });
    
    const response = await result.current.createUserAsync('0xASYNCUSER');
    
    expect(response).toMatchObject({
      userId: 'user-123',
      walletAddress: '0xASYNCUSER',
    });
  });

  it('handles createUserAsync rejection on error', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCreateUser(), { wrapper });
    
    await expect(
      result.current.createUserAsync('0xERROR')
    ).rejects.toThrow();
  });
});