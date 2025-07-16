import { useCallback } from "react";
import { useSnstrContext } from "@/contexts/snstr-context";
import { Filter, NostrEvent } from "snstr";

/**
 * Hook for interacting with the Nostr network
 * Provides methods for fetching and publishing events using the shared relay pool
 */
export function useNostr() {
  const { relayPool } = useSnstrContext();

  /**
   * Fetch a single event from the relay pool
   * Returns the most recent event matching the provided filter
   * 
   * @param filter - Filter object to match events (kinds, authors, since, until, etc.)
   * @param options - Optional configuration object
   * @param options.timeout - Maximum time to wait for response in milliseconds (default: 5000)
   * @returns Promise that resolves to the most recent matching event or null if none found
   */
  const fetchSingleEvent = useCallback(async (
    filter: Filter, 
    options: { timeout?: number } = {}
  ): Promise<NostrEvent | null> => {
    try {
      const event = await relayPool.get(
        ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'],
        filter,
        { timeout: options.timeout || 5000 }
      );
      
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }, [relayPool]);
 
  return {
    fetchSingleEvent
  };
}