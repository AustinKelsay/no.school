import type { SignedKind0Event } from '@/app/profile/actions'

type ProfileUpdateFields = {
  nip05?: string | null | undefined
  lud16?: string | null | undefined
  banner?: string | null | undefined
}

interface PrepareSignedProfileOptions {
  user: {
    pubkey?: string | null
    name?: string | null
    image?: string | null
  }
  nostrProfile?: Record<string, any> | null
  updates: ProfileUpdateFields
}

interface PrepareSignedProfileResult {
  signedEvent: SignedKind0Event
  updatedProfile: Record<string, any>
}

type UnsignedKind0Event = {
  kind: 0
  tags: string[][]
  content: string
  created_at: number
  pubkey: string
}


const normalizeUpdate = (value?: string | null): string | null | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

export async function prepareSignedNostrProfile({
  user,
  nostrProfile,
  updates,
}: PrepareSignedProfileOptions): Promise<PrepareSignedProfileResult> {
  if (!user?.pubkey) {
    throw new Error('Missing Nostr public key. Please reconnect your Nostr session.')
  }

  if (typeof window === "undefined") {
    throw new Error("Nostr signing is only available in the browser.")
  }

  const nostr = window.nostr
  if (!nostr?.signEvent) {
    throw new Error("Connect a Nostr (NIP-07) extension to publish profile changes.")
  }

  const baseProfile: Record<string, any> =
    nostrProfile && typeof nostrProfile === "object" ? { ...nostrProfile } : {}

  const applyField = (key: keyof ProfileUpdateFields, value: string | null | undefined) => {
    const normalized = normalizeUpdate(value)
    if (normalized === undefined) {
      return
    }
    if (normalized === null) {
      delete baseProfile[key]
    } else {
      baseProfile[key] = normalized
    }
  }

  applyField("nip05", updates.nip05)
  applyField("lud16", updates.lud16)
  applyField("banner", updates.banner)

  if (!baseProfile.name && user.name) {
    baseProfile.name = user.name
  }
  if (!baseProfile.display_name && user.name) {
    baseProfile.display_name = user.name
  }
  if (!baseProfile.picture && user.image) {
    baseProfile.picture = user.image
  }

  const unsignedEvent: UnsignedKind0Event = {
    kind: 0,
    tags: [],
    content: JSON.stringify(baseProfile),
    created_at: Math.floor(Date.now() / 1000),
    pubkey: user.pubkey,
  }

  let signed: Awaited<ReturnType<NonNullable<typeof window.nostr>['signEvent']>>
  try {
    signed = await nostr.signEvent(unsignedEvent)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to sign event: ${error.message}`)
    }
    throw new Error("User rejected signing or signing failed")
  }

  return {
    signedEvent: signed as SignedKind0Event,
    updatedProfile: baseProfile,
  }
}
