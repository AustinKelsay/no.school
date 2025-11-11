import { prisma } from './prisma'
import { RelayPool } from 'snstr'

const asString = (value: unknown): string | null => (typeof value === 'string' ? value : null)
const pickFirstString = (...values: unknown[]): string | null => {
  for (const value of values) {
    const str = asString(value)
    if (str) return str
  }
  return null
}

/**
 * Fetch ALL Nostr profile metadata (kind 0) for a given pubkey.
 */
export async function fetchNostrProfile(pubkey: string): Promise<Record<string, unknown> | null> {
  let relayPool: RelayPool | null = null
  try {
    relayPool = new RelayPool([
      'wss://relay.nostr.band',
      'wss://nos.lol',
      'wss://relay.damus.io'
    ])

    const profileEvent = await relayPool.get(
      ['wss://relay.nostr.band', 'wss://nos.lol', 'wss://relay.damus.io'],
      { kinds: [0], authors: [pubkey] },
      { timeout: 5000 }
    )

    if (!profileEvent || profileEvent.kind !== 0) {
      return null
    }

    try {
      return JSON.parse(profileEvent.content)
    } catch (parseError) {
      console.error('Failed to parse profile metadata:', parseError)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch Nostr profile:', error)
    return null
  } finally {
    if (relayPool) {
      try {
        await relayPool.close()
      } catch (closeError) {
        console.error('Failed to close Nostr relay pool:', closeError)
      }
    }
  }
}

/**
 * Sync selected user fields from a Nostr profile into the database.
 */
export async function syncUserProfileFromNostr(userId: string, pubkey: string) {
  try {
    console.log(`Syncing profile from Nostr for user ${userId} (pubkey: ${pubkey.substring(0, 8)}...)`)
    const nostrProfile = await fetchNostrProfile(pubkey)

    if (!nostrProfile) {
      console.log('No Nostr profile found, keeping existing database values')
      return await prisma.user.findUnique({ where: { id: userId } })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        avatar: true,
        nip05: true,
        lud16: true,
        banner: true
      }
    })

    if (!currentUser) {
      throw new Error('User not found in database')
    }

    const updates: { username?: string; avatar?: string; nip05?: string; lud16?: string; banner?: string } = {}
    const name = pickFirstString(nostrProfile.name, nostrProfile.username, nostrProfile.display_name)
    const picture = pickFirstString(nostrProfile.picture, nostrProfile.avatar, nostrProfile.image)
    const nip05 = asString(nostrProfile.nip05)
    const lud16 = asString(nostrProfile.lud16)
    const banner = asString(nostrProfile.banner)

    if (name && name !== currentUser.username) {
      updates.username = name
    }

    if (picture && picture !== currentUser.avatar) {
      updates.avatar = picture
    }

    if (nip05 && nip05 !== currentUser.nip05) {
      updates.nip05 = nip05
    }

    if (lud16 && lud16 !== currentUser.lud16) {
      updates.lud16 = lud16
    }

    if (banner && banner !== currentUser.banner) {
      updates.banner = banner
    }

    if (Object.keys(updates).length > 0) {
      console.log(`Applying ${Object.keys(updates).length} profile updates from Nostr`)
      return await prisma.user.update({
        where: { id: userId },
        data: updates
      })
    }

    return await prisma.user.findUnique({ where: { id: userId } })
  } catch (error) {
    console.error('Failed to sync user profile from Nostr:', error)
    return await prisma.user.findUnique({ where: { id: userId } })
  }
}
