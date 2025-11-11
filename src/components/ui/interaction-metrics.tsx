'use client'

import React, { useEffect, useState } from 'react'
import { Zap, MessageCircle, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createEvent, getEventHash, getPublicKey, signEvent, Prefix, type NostrEvent } from 'snstr'
import { useToast } from '@/hooks/use-toast'
import { useSnstrContext } from '@/contexts/snstr-context'
import { isNip07User } from '@/lib/nostr-events'
import { tryDecodeNip19Entity } from '@/lib/nip19-utils'

const HEX_64_REGEX = /^[0-9a-f]{64}$/i

function normalizeHexPubkey(value?: string | null): string | null {
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

function normalizeHexPrivkey(value?: string | null): string | null {
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

function buildReactionTags(
  eventId: string,
  eventPubkey?: string,
  eventKind?: number,
  eventIdentifier?: string
): string[][] {
  const tags: string[][] = [['e', eventId]]
  if (eventPubkey) {
    tags.push(['p', eventPubkey])
  }
  if (eventKind && eventKind >= 30000 && eventIdentifier && eventPubkey) {
    tags.push(['a', `${eventKind}:${eventPubkey}:${eventIdentifier}`])
  }
  return tags
}

function createUnsignedReaction(pubkey: string, tags: string[][]): Omit<NostrEvent, 'id' | 'sig'> {
  return createEvent(
    {
      kind: 7,
      content: '+',
      tags,
      created_at: Math.floor(Date.now() / 1000)
    },
    pubkey
  )
}

interface InteractionMetricsProps {
  /** Number of zaps */
  zapsCount: number
  /** Number of comments */
  commentsCount: number
  /** Number of likes/reactions */
  likesCount: number
  /** Loading state for zaps */
  isLoadingZaps?: boolean
  /** Loading state for comments */
  isLoadingComments?: boolean
  /** Loading state for likes */
  isLoadingLikes?: boolean
  /** Additional className for the container */
  className?: string
  /** Whether to show the interactions in a compact layout */
  compact?: boolean
  /** Whether the current viewer already reacted */
  hasReacted?: boolean
  /** Reaction target: event id */
  eventId?: string
  /** Reaction target kind (used for parameterized events) */
  eventKind?: number
  /** Reaction target author pubkey */
  eventPubkey?: string
  /** Reaction target identifier ("d" tag) */
  eventIdentifier?: string
}

/**
 * Reusable component for displaying interaction metrics (zaps, comments, likes)
 * Adds Nostr (kind 7) reaction publishing powered by snstr
 */
export function InteractionMetrics({
  zapsCount,
  commentsCount,
  likesCount,
  isLoadingZaps = false,
  isLoadingComments = false,
  isLoadingLikes = false,
  className = '',
  compact = false,
  hasReacted = false,
  eventId,
  eventKind,
  eventPubkey,
  eventIdentifier
}: InteractionMetricsProps) {
  const { data: session, status: sessionStatus } = useSession()
  const { toast } = useToast()
  const { publish } = useSnstrContext()
  const [isReacting, setIsReacting] = useState(false)
  const [optimisticReaction, setOptimisticReaction] = useState(false)
  const normalizedSessionPubkey = normalizeHexPubkey(session?.user?.pubkey)
  const normalizedSessionPrivkey = normalizeHexPrivkey(session?.user?.privkey)
  const canServerSign = Boolean(normalizedSessionPrivkey) && !isNip07User(session?.provider)

  useEffect(() => {
    if (hasReacted) {
      setOptimisticReaction(false)
    }
  }, [hasReacted])

  const handleScrollToComments = () => {
    const commentsSection = document.querySelector('[data-comments-section]')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSendReaction = async () => {
    if (!eventId) {
      toast({
        title: 'Reaction not available',
        description: 'This content is missing its Nostr event id, so reactions are disabled.',
        variant: 'destructive'
      })
      return
    }

    if (isReacting) {
      return
    }

    if (hasReacted || optimisticReaction) {
      toast({
        title: 'Already liked',
        description: 'You have already sent a reaction for this content.'
      })
      return
    }

    if (sessionStatus === 'loading') {
      toast({
        title: 'Hang tight',
        description: 'We are still loading your session. Try again in a moment.'
      })
      return
    }

    if (sessionStatus !== 'authenticated' || !session?.user) {
      toast({
        title: 'Sign in required',
        description: 'Sign in with a Nostr-capable account to send reactions.',
        variant: 'destructive'
      })
      return
    }

    const tags = buildReactionTags(eventId, eventPubkey, eventKind, eventIdentifier)

    try {
      setIsReacting(true)

      let signedReaction: NostrEvent
      if (canServerSign && normalizedSessionPrivkey) {
        let pubkey: string
        try {
          pubkey = getPublicKey(normalizedSessionPrivkey)
        } catch (err) {
          throw new Error('Stored private key is invalid. Please relink your account and try again.')
        }
        const unsignedReaction = createUnsignedReaction(pubkey, tags)
        const reactionId = await getEventHash(unsignedReaction)
        const reactionSig = await signEvent(reactionId, normalizedSessionPrivkey)
        signedReaction = { ...unsignedReaction, id: reactionId, sig: reactionSig }
      } else {
        const nostr = typeof window !== 'undefined' ? (window as Window & { nostr?: any }).nostr : undefined
        if (!nostr?.signEvent || !nostr?.getPublicKey) {
          throw new Error('Connect a Nostr (NIP-07) extension like Alby or nos2x to send reactions.')
        }
        const extensionPubkey = await nostr.getPublicKey()
        const normalizedExtensionPubkey = normalizeHexPubkey(extensionPubkey)
        if (!normalizedExtensionPubkey) {
          throw new Error('The connected Nostr extension returned an invalid public key.')
        }
        const unsignedReaction = createUnsignedReaction(normalizedExtensionPubkey, tags)
        signedReaction = await nostr.signEvent(unsignedReaction)
      }

      await publish(signedReaction)
      setOptimisticReaction(true)
      toast({
        title: 'Reaction sent',
        description: 'Your like was published to the relays.'
      })
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unable to publish your reaction.'
      toast({
        title: 'Reaction failed',
        description,
        variant: 'destructive'
      })
    } finally {
      setIsReacting(false)
    }
  }

  const spacing = compact ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6'
  const iconSize = compact ? 'h-4 w-4' : 'h-5 w-5'
  const textSize = compact ? 'text-xs' : 'text-xs sm:text-sm'

  const pendingReaction = optimisticReaction && !hasReacted
  const liked = hasReacted || pendingReaction
  const showLikeSpinner = isLoadingLikes || isReacting
  const displayedLikes = likesCount + (pendingReaction ? 1 : 0)
  const likeIconClass = liked
    ? 'text-pink-500 fill-pink-500'
    : 'text-muted-foreground group-hover:text-pink-500'
  const likeCountClass = liked
    ? 'text-pink-500'
    : 'text-foreground group-hover:text-pink-500'
  const likeLabelClass = liked
    ? 'text-pink-500'
    : 'text-muted-foreground group-hover:text-pink-500'

  return (
    <div className={`flex items-center flex-wrap ${spacing} ${className}`}>
      {/* Zaps */}
      <button
        type="button"
        className={`group flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer bg-transparent border-0 p-0 ${compact ? '' : ''}`}
        onClick={handleScrollToComments}
      >
        <Zap className={`${iconSize} text-muted-foreground group-hover:text-amber-500 transition-colors`} />
        <span className="font-medium text-foreground group-hover:text-amber-500 transition-colors">
          {isLoadingZaps ? (
            <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          ) : (
            zapsCount.toLocaleString()
          )}
        </span>
        <span className={`text-muted-foreground group-hover:text-amber-500 transition-colors ${textSize}`}>
          zaps
        </span>
      </button>
      
      {/* Comments */}
      <button
        type="button"
        className="group flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer bg-transparent border-0 p-0"
        onClick={handleScrollToComments}
      >
        <MessageCircle className={`${iconSize} text-muted-foreground group-hover:text-blue-500 transition-colors`} />
        <span className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
          {isLoadingComments ? (
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : (
            commentsCount.toLocaleString()
          )}
        </span>
        <span className={`text-muted-foreground group-hover:text-blue-500 transition-colors ${textSize}`}>
          comments
        </span>
      </button>
      
      {/* Likes / Reactions */}
      <button
        type="button"
        onClick={handleSendReaction}
        className={`group flex items-center space-x-1.5 sm:space-x-2 transition-colors bg-transparent border-0 p-0 ${isReacting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        disabled={isReacting}
      >
        {showLikeSpinner ? (
          <div className={`${iconSize} rounded-full border-2 border-pink-500 border-t-transparent animate-spin`}></div>
        ) : (
          <Heart
            className={`${iconSize} transition-colors ${likeIconClass}`}
          />
        )}
        <span className={`font-medium transition-colors ${likeCountClass}`}>
          {showLikeSpinner ? '—' : displayedLikes.toLocaleString()}
        </span>
        <span className={`transition-colors ${likeLabelClass} ${textSize}`}>
          likes
        </span>
      </button>
    </div>
  )
}
