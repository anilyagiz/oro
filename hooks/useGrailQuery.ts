import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

export function useGrailQuery<TData = unknown, TError = Error>(
  key: string[],
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    ...options,
  });
}

export function useGrailMutation<TData = unknown, TError = Error, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>(options);
}

export function useGrailInfiniteQuery<TData = unknown, TError = Error>(
  key: string[],
  options?: Omit<UseInfiniteQueryOptions<TData, TError, TData, TData, string[]>, 'queryKey'>
) {
  return useInfiniteQuery<TData, TError>({
    queryKey: key,
    ...options,
  });
}
