"use client";

import { createContext, useContext, useRef, ReactNode } from 'react';
import { RelayPool, Filter, NostrEvent } from 'snstr';

// Default relay URLs
const DEFAULT_RELAYS = [
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.damus.io'
];

// Types for the context
interface SnstrContextType {
  relayPool: RelayPool;
  relays: string[];
  subscribe: (
    filters: Filter[], 
    onEvent: (event: NostrEvent, relayUrl: string) => void, 
    onEose?: () => void
  ) => Promise<{ close: () => void }>;
  publish: (event: NostrEvent) => Promise<unknown[]>;
}

// Create the context
const SnstrContext = createContext<SnstrContextType | null>(null);

// Provider component
export function SnstrProvider({ children, relays = DEFAULT_RELAYS }: { children: ReactNode; relays?: string[] }) {
  // Use ref to ensure single instance across re-renders
  const poolRef = useRef<RelayPool | null>(null);

  if (!poolRef.current) {
    poolRef.current = new RelayPool(relays);
  }

  // Simple subscribe method that uses the shared pool
  const subscribe = async (
    filters: Filter[], 
    onEvent: (event: NostrEvent, relayUrl: string) => void,
    onEose?: () => void
  ) => {
    return poolRef.current!.subscribe(
      relays,
      filters,
      onEvent,
      onEose || (() => {})
    );
  };

  // Simple publish method that uses the shared pool
  const publish = async (event: NostrEvent) => {
    const publishPromises = poolRef.current!.publish(relays, event);
    return Promise.all(publishPromises);
  };

  const contextValue: SnstrContextType = {
    relayPool: poolRef.current,
    relays,
    subscribe,
    publish
  };

  return (
    <SnstrContext.Provider value={contextValue}>
      {children}
    </SnstrContext.Provider>
  );
}

// Hook to use the context
export function useSnstrContext(): SnstrContextType {
  const context = useContext(SnstrContext);
  if (!context) {
    throw new Error('useSnstrContext must be used within SnstrProvider');
  }
  return context;
}