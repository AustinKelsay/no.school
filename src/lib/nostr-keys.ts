import { Prefix } from 'snstr'
import { tryDecodeNip19Entity } from '@/lib/nip19-utils'

const HEX_64_REGEX = /^[0-9a-f]{64}$/i

export function normalizeHexPubkey(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (HEX_64_REGEX.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  const decoded = tryDecodeNip19Entity(trimmed)
  if (!decoded) {
    return null
  }

  if (decoded.type === Prefix.PublicKey) {
    return decoded.data.toLowerCase()
  }

  if (decoded.type === Prefix.Profile) {
    return decoded.data.pubkey?.toLowerCase() ?? null
  }

  return null
}

export function normalizeHexPrivkey(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (HEX_64_REGEX.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  const decoded = tryDecodeNip19Entity(trimmed)
  if (decoded?.type === Prefix.PrivateKey) {
    return decoded.data.toLowerCase()
  }

  return null
}
