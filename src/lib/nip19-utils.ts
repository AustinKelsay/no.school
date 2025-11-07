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

/**
 * Branded type for validated NIP-19 strings.
 * This ensures type safety by requiring validation via isNip19String before use.
 */
export type Nip19String = string & { __nip19Brand: void }

/**
 * Type guard that validates a string matches the NIP-19 pattern.
 * Tests against the runtime pattern to ensure the string is a valid NIP-19 entity.
 *
 * @param value - The string to validate
 * @returns True if the string matches the NIP-19 pattern, false otherwise
 */
export function isNip19String(value: string): value is Nip19String {
  return NIP19_PATTERN.test(value)
}

/**
 * Decodes a validated NIP-19 entity string.
 * Requires a Nip19String (validated via isNip19String) to ensure type safety.
 *
 * @param value - A validated NIP-19 string
 * @returns The decoded and filtered entity data
 */
export function decodeNip19Entity(value: Nip19String): SafeDecodedEntity {
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
