"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

/**
 * QueryClient provider for TanStack Query
 * Provides caching, synchronization, and state management for server state
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: How long data is considered fresh
        staleTime: 60 * 1000, // 1 minute
        // GC time: How long data stays in cache after becoming unused
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Retry configuration
        retry: (failureCount, error) => {
          // Don't retry on 404s or client errors
          if (error instanceof Error && error.message.includes('404')) {
            return false;
          }
          return failureCount < 3;
        },
        // Don't refetch on window focus for better UX
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 