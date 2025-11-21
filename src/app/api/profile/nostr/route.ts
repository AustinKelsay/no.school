import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchNostrProfile } from '@/lib/nostr-profile'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.pubkey) {
      return NextResponse.json(
        { error: 'Nostr profile unavailable', profile: null },
        { status: 400 }
      )
    }

    const profile = await fetchNostrProfile(session.user.pubkey)

    return NextResponse.json({
      profile: profile ?? null,
    })
  } catch (error) {
    console.error('Failed to load Nostr profile metadata:', error)
    return NextResponse.json(
      { error: 'Failed to load Nostr profile metadata' },
      { status: 500 }
    )
  }
}
