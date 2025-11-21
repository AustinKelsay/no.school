import { bech32 } from '@scure/base'
import { decodeLnurl } from 'snstr'
import type { LightningRecipient } from '@/types/zap'

export interface LnurlDetails {
  /** bech32-encoded lnurl string */
  lnurlBech32: string
  /** HTTPS endpoint for clearnet, or HTTP for Tor onion addresses */
  endpointUrl: string
  /** Input string used for metadata fetch (lnurl or lightning address) */
  fetchInput: string
  /** Optional human-friendly identifier */
  identifier?: string
}

const textEncoder = new TextEncoder()

export function encodeLnurl(url: string): string {
  const words = bech32.toWords(textEncoder.encode(url))
  // LNURL strings may be uppercase but we normalize to lowercase for consistency
  return bech32.encode('lnurl', words, 1023).toLowerCase()
}

export function buildLightningAddressEndpoint(lightningAddress: string): string | null {
  if (!lightningAddress || !lightningAddress.includes('@')) {
    return null
  }
  const [rawUsername, rawDomain] = lightningAddress.split('@')
  const username = rawUsername?.trim()
  const domain = rawDomain?.trim()
  if (!username || !domain) {
    return null
  }
  const normalizedDomain = domain.toLowerCase()
  const scheme = normalizedDomain.endsWith('.onion') ? 'http' : 'https'
  return `${scheme}://${normalizedDomain}/.well-known/lnurlp/${username}`
}

function isAllowedLnurlEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint)
    const hostname = url.hostname.toLowerCase()

    if (url.protocol === 'https:') {
      return true
    }

    if (url.protocol === 'http:' && hostname.endsWith('.onion')) {
      return true
    }

    return false
  } catch (error) {
    console.error('deriveLnurlDetails: invalid LNURL endpoint URL', endpoint, error)
    return false
  }
}

export function deriveLnurlDetails(target?: LightningRecipient): LnurlDetails | null {
  if (!target) {
    return null
  }

  const candidateLnurl = target.lnurl?.trim()

  if (candidateLnurl) {
    if (candidateLnurl.toLowerCase().startsWith('lnurl')) {
      try {
        const endpoint = decodeLnurl(candidateLnurl)
        if (!endpoint) {
          return null
        }
        if (!isAllowedLnurlEndpoint(endpoint)) {
          console.error(
            'deriveLnurlDetails: lnurl endpoint must use https:// for clearnet or http:// for .onion hosts',
            endpoint
          )
          return null
        }
        return {
          lnurlBech32: candidateLnurl.toLowerCase(),
          endpointUrl: endpoint,
          fetchInput: candidateLnurl,
          identifier: target.lightningAddress || target.name
        }
      } catch {
        return null
      }
    }

    if (candidateLnurl.startsWith('http://') || candidateLnurl.startsWith('https://')) {
      if (!isAllowedLnurlEndpoint(candidateLnurl)) {
        console.error(
          'deriveLnurlDetails: direct LNURL endpoint must use https:// for clearnet or http:// for .onion hosts',
          candidateLnurl
        )
        return null
      }
      return {
        lnurlBech32: encodeLnurl(candidateLnurl),
        endpointUrl: candidateLnurl,
        fetchInput: candidateLnurl,
        identifier: target.lightningAddress || target.name
      }
    }
  }

  if (target.lightningAddress) {
    const endpoint = buildLightningAddressEndpoint(target.lightningAddress)
    if (!endpoint) {
      return null
    }
    return {
      lnurlBech32: encodeLnurl(endpoint),
      endpointUrl: endpoint,
      fetchInput: target.lightningAddress,
      identifier: target.lightningAddress
    }
  }

  return null
}

export function msatsToSats(msats?: number | null): number | null {
  if (typeof msats !== 'number' || Number.isNaN(msats)) {
    return null
  }
  return Math.max(0, Math.floor(msats / 1000))
}

export function getByteLength(value: string): number {
  return textEncoder.encode(value).length
}

export function truncateToByteLength(value: string, maxBytes: number): string {
  const encoded = textEncoder.encode(value)
  if (encoded.length <= maxBytes) {
    return value
  }

  let endIndex = maxBytes
  // Ensure we cut on character boundaries by decoding progressively
  while (endIndex > 0 && (encoded[endIndex] & 0xc0) === 0x80) {
    endIndex -= 1
  }

  return new TextDecoder().decode(encoded.slice(0, endIndex))
}
