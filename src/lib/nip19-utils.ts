import {
  Prefix,
  decode,
  filterAddress,
  filterEvent,
  filterProfile,
  type AddressData,
  type DecodedEntity,
  type EventData,
  type ProfileData,
} from "snstr"

export type SafeDecodedEntity =
  | Extract<DecodedEntity, { type: Prefix.PublicKey | Prefix.PrivateKey | Prefix.Note }>
  | { type: Prefix.Profile; data: ProfileData }
  | { type: Prefix.Event; data: EventData }
  | { type: Prefix.Address; data: AddressData }

const NIP19_PATTERN = /^(npub|nsec|note|nevent|naddr|nprofile)1[a-z0-9]+$/i

export function isNip19String(value: string): value is `${string}1${string}` {
  return NIP19_PATTERN.test(value)
}

export function decodeNip19Entity(value: `${string}1${string}`): SafeDecodedEntity {
  const decoded = decode(value)

  switch (decoded.type) {
    case Prefix.Profile:
      return { type: Prefix.Profile, data: filterProfile(decoded.data) }
    case Prefix.Event:
      return { type: Prefix.Event, data: filterEvent(decoded.data) }
    case Prefix.Address:
      return { type: Prefix.Address, data: filterAddress(decoded.data) }
    default:
      return decoded as SafeDecodedEntity
  }
}

export function tryDecodeNip19Entity(value: string): SafeDecodedEntity | null {
  if (!isNip19String(value)) {
    return null
  }

  try {
    return decodeNip19Entity(value)
  } catch (error) {
    console.error("Failed to decode NIP-19 entity safely", error)
    return null
  }
}
