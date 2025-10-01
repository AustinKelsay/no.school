import nostrConfig from '../../config/nostr.json'

export type RelaySet = 'default' | 'content' | 'profile' | 'zapThreads'

type NostrRelayConfig = {
  relays: Record<string, string[]>
}

function unique(list: string[]): string[] {
  return Array.from(new Set(list))
}

/**
 * Get relays for a given set, falling back to `default` when the set is
 * undefined or empty. Ensures the list is de-duplicated.
 */
export function getRelays(set: RelaySet = 'default'): string[] {
  const cfg = (nostrConfig as unknown as NostrRelayConfig).relays || {}
  const chosen = cfg[set] || []
  const base = cfg.default || []
  const relays = chosen.length > 0 ? chosen : base
  return unique(relays)
}

export const DEFAULT_RELAYS = getRelays('default')

