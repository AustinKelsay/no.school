import { useCallback } from "react";
import { DEFAULT_RELAYS, useSnstrContext } from "@/contexts/snstr-context";
import { Filter, NostrEvent, Prefix } from "snstr";
import { tryDecodeNip19Entity } from "@/lib/nip19-utils";

/**
 * Normalized profile data extracted from a kind 0 event
 */
export interface NormalizedProfile {
  /** Display name or nickname */
  name?: string;
  /** Short bio or description */
  about?: string;
  /** Profile picture URL */
  picture?: string;
  /** User's website URL */
  website?: string;
  /** NIP-05 DNS identifier */
  nip05?: string;
  /** Lightning address for zaps */
  lud16?: string;
  /** Lightning URL for zaps (legacy) */
  lud06?: string;
  /** Banner image URL */
  banner?: string;
  /** Display name for UI purposes */
  display_name?: string;
  /** Location information */
  location?: string;
  /** Raw JSON string from the event content */
  raw?: string;
  /** Event creation timestamp */
  created_at?: number;
  /** Public key of the profile owner */
  pubkey?: string;
}

/**
 * Hook for interacting with the Nostr network
 * Provides methods for fetching and publishing events using the shared relay pool
 */
export function useNostr() {
  const { relayPool } = useSnstrContext();

  /**
   * Helper function to normalize different pubkey formats to hex
   * @param pubkeyInput - Can be npub, hex pubkey, or nprofile
   * @returns Hex public key string
   */
  const normalizePubkey = useCallback((pubkeyInput: string): string => {
    // If it's already a hex string (64 chars, no prefix)
    if (/^[0-9a-f]{64}$/i.test(pubkeyInput)) {
      return pubkeyInput.toLowerCase();
    }

    // Try generic decode for all NIP-19 formats (npub, nprofile, etc.)
    const decoded = tryDecodeNip19Entity(pubkeyInput);
    if (decoded?.type === Prefix.PublicKey) {
      return decoded.data;
    }
    if (decoded?.type === Prefix.Profile) {
      return decoded.data.pubkey;
    }

    return pubkeyInput;
  }, []);

  /**
   * Fetch a single event from the relay pool
   * Returns the most recent event matching the provided filter
   * 
   * @param filter - Filter object to match events (kinds, authors, since, until, etc.)
   * @param options - Optional configuration object
   * @param options.timeout - Maximum time to wait for response in milliseconds (default: 5000)
   * @param options.relays - Optional array of relay URLs to query (defaults to DEFAULT_RELAYS)
   * @returns Promise that resolves to the most recent matching event or null if none found
   */
  const fetchSingleEvent = useCallback(async (
    filter: Filter, 
    options: { timeout?: number; relays?: string[] } = {}
  ): Promise<NostrEvent | null> => {
    try {
      const relays = options.relays && options.relays.length > 0 ? options.relays : DEFAULT_RELAYS
      const event = await relayPool.get(
        relays,
        filter,
        { timeout: options.timeout || 5000 }
      );
      
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }, [relayPool]);

  /**
   * Fetch a user's profile (kind 0 event) from their npub, hex pubkey, or nprofile
   * @param pubkeyInput - Can be npub, hex pubkey, or nprofile
   * @param options - Optional configuration object
   * @param options.timeout - Maximum time to wait for response in milliseconds (default: 5000)
   * @returns Promise that resolves to the user's profile event or null if none found
   */
  const fetchProfile = useCallback(async (
    pubkeyInput: string,
    options: { timeout?: number } = {}
  ): Promise<NostrEvent | null> => {
    try {
      // Normalize the pubkey to hex format
      const hexPubkey = normalizePubkey(pubkeyInput);
      
      // Create filter for kind 0 (profile metadata) events from this author
      const filter: Filter = {
        kinds: [0],
        authors: [hexPubkey],
        limit: 1
      };

      const profileEvent = await relayPool.get(
        DEFAULT_RELAYS,
        filter,
        { timeout: options.timeout || 5000 }
      );
      
      return profileEvent;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [relayPool, normalizePubkey]);

  /**
   * Normalize and extract profile fields from a kind 0 (user metadata) event
   * @param profileEvent - The kind 0 NostrEvent containing profile metadata
   * @returns Normalized profile data with common fields extracted and parsed
   */
  const normalizeKind0 = useCallback((profileEvent: NostrEvent | null): NormalizedProfile | null => {
    if (!profileEvent || profileEvent.kind !== 0) {
      return null;
    }

    try {
      // Parse the JSON content
      const profileData = JSON.parse(profileEvent.content);
      
      // Extract and normalize common profile fields
      const normalized: NormalizedProfile = {
        name: profileData.name || profileData.username,
        about: profileData.about || profileData.bio,
        picture: profileData.picture || profileData.avatar,
        website: profileData.website || profileData.url,
        nip05: profileData.nip05,
        lud16: profileData.lud16,
        lud06: profileData.lud06,
        banner: profileData.banner,
        display_name: profileData.display_name || profileData.displayName,
        location: profileData.location,
        raw: profileEvent.content,
        created_at: profileEvent.created_at,
        pubkey: profileEvent.pubkey
      };

      // Remove undefined fields for cleaner output
      Object.keys(normalized).forEach(key => {
        if (normalized[key as keyof NormalizedProfile] === undefined) {
          delete normalized[key as keyof NormalizedProfile];
        }
      });

      return normalized;
    } catch (error) {
      console.error('Error parsing kind 0 event content:', error);
      
      // Return minimal profile with fallback data
      return {
        raw: profileEvent.content,
        created_at: profileEvent.created_at,
        pubkey: profileEvent.pubkey
      };
    }
  }, []);
 
  return {
    fetchSingleEvent,
    fetchProfile,
    normalizeKind0
  };
}
