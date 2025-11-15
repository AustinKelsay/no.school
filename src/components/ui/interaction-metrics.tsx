'use client'

import React, { useEffect, useState } from 'react'
import { Zap, MessageCircle, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createEvent, getEventHash, getPublicKey, signEvent, type NostrEvent } from 'snstr'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSnstrContext } from '@/contexts/snstr-context'
import { DEFAULT_ZAP_INSIGHTS, type ZapInsights, type ZapReceiptSummary } from '@/hooks/useInteractions'
import { isNip07User } from '@/lib/nostr-events'
import { normalizeHexPrivkey, normalizeHexPubkey } from '@/lib/nostr-keys'
import { getByteLength } from '@/lib/lightning'
import { useZapSender } from '@/hooks/useZapSender'
import type { LightningRecipient } from '@/types/zap'

const QUICK_ZAP_AMOUNTS = [21, 100, 500, 1000, 2100] as const
const ZAP_ACTIVITY_PREVIEW_LENGTH = 5
const MIN_CUSTOM_ZAP = 1
type QuickZapAmount = (typeof QUICK_ZAP_AMOUNTS)[number]

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

function formatNumberDisplay(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—'
  }
  return value.toLocaleString()
}

function formatSatsDisplay(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—'
  }
  return `${value.toLocaleString()} sats`
}

function formatShortPubkey(pubkey?: string | null): string {
  if (!pubkey || pubkey.length < 12) {
    return pubkey || 'unknown zapper'
  }
  return `${pubkey.slice(0, 6)}…${pubkey.slice(-4)}`
}

function formatRelativeTimestamp(seconds?: number | null): string {
  if (!seconds) {
    return '—'
  }

  const now = Date.now()
  const diffMs = now - seconds * 1000
  const safeDiff = Math.max(diffMs, 0)
  const minutes = Math.floor(safeDiff / 60000)

  if (minutes < 1) {
    return 'just now'
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days}d ago`
  }

  return new Date(seconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
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
  /** Lightning recipient + invoice hints */
  zapTarget?: LightningRecipient
  /** Aggregated zap stats */
  zapInsights?: ZapInsights
  /** Preview of recent zap receipts */
  recentZaps?: ZapReceiptSummary[]
  /** Whether the current viewer has already zapped */
  hasZappedWithLightning?: boolean
  /** Total sats the viewer has contributed to this event */
  viewerZapTotalSats?: number
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
  eventIdentifier,
  zapTarget,
  zapInsights = DEFAULT_ZAP_INSIGHTS,
  recentZaps = [],
  hasZappedWithLightning = false,
  viewerZapTotalSats = 0
}: InteractionMetricsProps) {
  const { data: session, status: sessionStatus } = useSession()
  const { toast } = useToast()
  const { publish } = useSnstrContext()
  const [isReacting, setIsReacting] = useState(false)
  const [optimisticReaction, setOptimisticReaction] = useState(false)
  const [isZapDialogOpen, setIsZapDialogOpen] = useState(false)
  const [selectedZapAmount, setSelectedZapAmount] = useState<QuickZapAmount>(QUICK_ZAP_AMOUNTS[1])
  const [customZapAmount, setCustomZapAmount] = useState('')
  const [zapNote, setZapNote] = useState('')
  const normalizedSessionPubkey = normalizeHexPubkey(session?.user?.pubkey)
  const normalizedSessionPrivkey = normalizeHexPrivkey(session?.user?.privkey)
  const canServerSign = Boolean(normalizedSessionPrivkey) && !isNip07User(session?.provider)

  const {
    sendZap,
    retryWeblnPayment,
    resetZapState,
    zapState,
    isZapInFlight,
    minZapSats,
    maxZapSats
  } = useZapSender({
    eventId,
    eventKind,
    eventIdentifier,
    eventPubkey,
    zapTarget
  })

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

  const handleSelectQuickAmount = (amount: QuickZapAmount) => {
    setSelectedZapAmount(amount)
    setCustomZapAmount('')
  }

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/[^0-9]/g, '')
    setCustomZapAmount(digitsOnly)
  }

  const handleZapDialogOpenChange = (open: boolean) => {
    setIsZapDialogOpen(open)
    if (!open) {
      setCustomZapAmount('')
      setSelectedZapAmount(QUICK_ZAP_AMOUNTS[1])
      setZapNote('')
      resetZapState()
    }
  }

  const handleSendZap = async () => {
    if (zapActionUnavailable) {
      toast({
        title: 'Adjust zap amount',
        description: amountOutOfRange
          ? `Pick an amount between ${minZapSats?.toLocaleString() ?? '—'} and ${maxZapSats?.toLocaleString() ?? '—'} sats.`
          : `Enter at least ${MIN_CUSTOM_ZAP} sat to send a zap.`,
        variant: 'destructive'
      })
      return
    }

    try {
      const result = await sendZap({ amountSats: resolvedZapAmount, note: zapNote })
      toast({
        title: result.paid ? 'Zap sent ⚡️' : 'Invoice ready',
        description: result.paid
          ? 'Thanks for supporting the creator!'
          : 'Copy the invoice below or open it in your Lightning wallet to finish.'
      })
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unable to send zap.'
      toast({ title: 'Zap failed', description, variant: 'destructive' })
    }
  }

  const handleCopyInvoice = async () => {
    if (!zapState.invoice) {
      return
    }
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast({
        title: 'Clipboard unavailable',
        description: 'Copy the invoice manually from the text block below.',
        variant: 'destructive'
      })
      return
    }
    try {
      await navigator.clipboard.writeText(zapState.invoice)
      toast({ title: 'Invoice copied', description: 'Paste into any Lightning wallet to pay.' })
    } catch (error) {
      toast({
        title: 'Unable to copy invoice',
        description: error instanceof Error ? error.message : 'Clipboard access denied.',
        variant: 'destructive'
      })
    }
  }

  const handleRetryWebln = async () => {
    const paid = await retryWeblnPayment()
    toast({
      title: paid ? 'Zap paid via WebLN' : 'WebLN payment failed',
      description: paid
        ? 'Thanks for the zap!'
        : 'Copy the invoice below or open it in your wallet to finish.',
      variant: paid ? 'default' : 'destructive'
    })
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
  const zapStats = zapInsights || DEFAULT_ZAP_INSIGHTS
  const zapActivityPreview = recentZaps.slice(0, ZAP_ACTIVITY_PREVIEW_LENGTH)
  const trimmedCustomInput = customZapAmount.replace(/^0+(?=\d)/, '')
  const hasCustomAmount = trimmedCustomInput.length > 0
  const parsedCustomAmount = hasCustomAmount ? Number(trimmedCustomInput) : NaN
  const customAmountInvalid = hasCustomAmount && (!Number.isFinite(parsedCustomAmount) || parsedCustomAmount < MIN_CUSTOM_ZAP)
  const resolvedZapAmount = hasCustomAmount && !customAmountInvalid ? Math.floor(parsedCustomAmount) : selectedZapAmount
  const zapTargetName = zapTarget?.name || 'this creator'
  const zapLightningIdentifier =
    zapTarget?.lightningAddress ||
    zapTarget?.lnurl ||
    zapState.lnurlDetails?.identifier ||
    zapState.lnurlDetails?.endpointUrl ||
    ''
  const zapTargetHasLightning = Boolean(zapLightningIdentifier)
  const belowMinAmount = typeof minZapSats === 'number' ? resolvedZapAmount < minZapSats : false
  const aboveMaxAmount = typeof maxZapSats === 'number' ? resolvedZapAmount > maxZapSats : false
  const amountOutOfRange = belowMinAmount || aboveMaxAmount
  const zapActionUnavailable =
    customAmountInvalid ||
    resolvedZapAmount < MIN_CUSTOM_ZAP ||
    !zapTargetHasLightning ||
    amountOutOfRange
  const zapCtaDisabled = zapActionUnavailable || isZapInFlight
  const lightningAddressDisplay = zapLightningIdentifier || 'Creator has not linked a lightning address yet.'
  const viewerZapSummaryText = zapState.status === 'success'
    ? 'Zap sent! Receipts usually land within a few seconds.'
    : hasZappedWithLightning
      ? `You have tipped ${formatSatsDisplay(viewerZapTotalSats)} so far.`
      : 'You have not zapped this content yet.'
  const zapButtonSecondaryLabel = (() => {
    if (zapState.status === 'error') {
      return 'retry'
    }
    if (zapState.status === 'success') {
      return 'paid'
    }
    if (zapState.status === 'invoice-ready') {
      return 'invoice'
    }
    if (zapState.status === 'paying') {
      return 'webln'
    }
    return zapStats.totalSats > 0 ? `${zapStats.totalSats.toLocaleString()} sats` : null
  })()
  const zapStatusMessages: Record<string, string> = {
    resolving: 'Resolving lightning address…',
    signing: 'Creating zap request…',
    'requesting-invoice': 'Waiting for the wallet invoice…',
    paying: 'Attempting WebLN payment…',
    'invoice-ready': zapState.weblnError
      ? 'Invoice ready. Pay manually or retry WebLN.'
      : 'Invoice ready. Open your Lightning wallet to finish.',
    success: 'Zap paid! Receipt will appear once the relay publishes it.',
    error: zapState.error || 'Zap failed. Adjust the amount or try again.'
  }
  const zapDialogStatusMessage = zapStatusMessages[zapState.status] || ''
  const zapCommentLimitBytes = zapState.metadata?.commentAllowed ?? 280
  const zapNoteBytesUsed = getByteLength(zapNote)
  const zapNoteBytesRemaining = Math.max(0, zapCommentLimitBytes - zapNoteBytesUsed)

  return (
    <div className={`flex items-center flex-wrap ${spacing} ${className}`}>
      {/* Zaps */}
      <Dialog open={isZapDialogOpen} onOpenChange={handleZapDialogOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={`group flex items-center space-x-1.5 sm:space-x-2 transition-colors cursor-pointer bg-transparent border-0 p-0 ${compact ? '' : ''}`}
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
            {!compact && zapButtonSecondaryLabel && (
              <span className="text-[11px] text-muted-foreground group-hover:text-amber-500 transition-colors">
                {zapButtonSecondaryLabel}
              </span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-lg sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send a zap</DialogTitle>
            <DialogDescription>
              Lightning tips — also called zaps — let you support {zapTargetName}. We’ll resolve their Lightning address, request an invoice, and try WebLN automatically if your wallet allows it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Total sats</p>
                <p className="text-base font-semibold">{formatNumberDisplay(zapStats.totalSats)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Supporters</p>
                <p className="text-base font-semibold">{formatNumberDisplay(zapStats.uniqueSenders)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Avg. zap</p>
                <p className="text-base font-semibold">{formatSatsDisplay(zapStats.averageSats)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Last zap</p>
                <p className="text-base font-semibold">{formatRelativeTimestamp(zapStats.lastZapAt)}</p>
              </div>
            </div>

            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              {viewerZapSummaryText}
            </div>

            {zapDialogStatusMessage && (
              <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                {zapDialogStatusMessage}
              </div>
            )}

            {zapState.weblnError && (
              <p className="text-xs text-destructive">WebLN error: {zapState.weblnError}</p>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Choose an amount</Label>
                <span className="text-xs text-muted-foreground">Selected: {formatSatsDisplay(resolvedZapAmount)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_ZAP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleSelectQuickAmount(amount)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      selectedZapAmount === amount && !hasCustomAmount
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                        : 'border-border text-foreground hover:border-amber-500'
                    }`}
                  >
                    {amount.toLocaleString()} sats
                  </button>
                ))}
                <div className="flex flex-col">
                  <Label htmlFor="custom-zap" className="text-xs text-muted-foreground">
                    Custom
                  </Label>
                  <Input
                    id="custom-zap"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="420"
                    value={customZapAmount}
                    onChange={handleCustomAmountChange}
                    className="h-9 w-28"
                  />
                </div>
              </div>
              {customAmountInvalid && (
                <p className="text-xs text-destructive">Enter at least {MIN_CUSTOM_ZAP} sat.</p>
              )}
              {(minZapSats || maxZapSats) && (
                <p className="text-xs text-muted-foreground">
                  Range: {minZapSats?.toLocaleString() ?? '—'} – {maxZapSats?.toLocaleString() ?? '—'} sats
                </p>
              )}
              {amountOutOfRange && (
                <p className="text-xs text-destructive">Choose an amount within the allowed range.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zap-note">Add a note (optional)</Label>
              <Textarea
                id="zap-note"
                value={zapNote}
                maxLength={140}
                onChange={(event) => setZapNote(event.target.value)}
                placeholder={`Tell ${zapTargetName} why this resonated.`}
              />
              <p className="text-xs text-muted-foreground">
                {zapNoteBytesRemaining} bytes left (wallet allows up to {zapCommentLimitBytes})
              </p>
            </div>

            <div className="space-y-2 rounded-lg border p-4 text-sm">
              <p className="font-medium text-foreground">Lightning address</p>
              <p className="break-all text-muted-foreground">{lightningAddressDisplay}</p>
              {zapTarget?.pubkey && (
                <p className="text-xs text-muted-foreground">Pubkey: {formatShortPubkey(zapTarget.pubkey)}</p>
              )}
              {!zapTargetHasLightning && (
                <p className="text-xs text-destructive">Ask the author to add a Lightning address to their profile.</p>
              )}
            </div>

            <Button className="w-full" size="lg" onClick={handleSendZap} disabled={zapCtaDisabled}>
              {isZapInFlight ? 'Sending zap…' : `Send ${resolvedZapAmount.toLocaleString()} sats`}
            </Button>

            {zapState.invoice && (
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Invoice</Label>
                  {zapState.paid && <span className="text-xs text-emerald-500">paid</span>}
                </div>
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs">
                  {zapState.invoice}
                </pre>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={handleCopyInvoice}>
                    Copy invoice
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`lightning:${zapState.invoice}`}>
                      Open wallet
                    </a>
                  </Button>
                  {zapState.status === 'invoice-ready' && (
                    <Button variant="ghost" onClick={handleRetryWebln} disabled={isZapInFlight}>
                      Retry WebLN
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Recent supporters</p>
                <span className="text-xs text-muted-foreground">Live preview</span>
              </div>
              {zapActivityPreview.length === 0 ? (
                <p className="text-sm text-muted-foreground">No zaps yet. Be the first to zap this drop.</p>
              ) : (
                <div className="space-y-2">
                  {zapActivityPreview.map((zap) => (
                    <div key={zap.id} className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm">
                      <div>
                        <p className="font-semibold">{formatSatsDisplay(zap.amountSats)}</p>
                        <p className="text-xs text-muted-foreground">{formatShortPubkey(zap.senderPubkey)}</p>
                        {zap.note && <p className="mt-1 text-xs">{zap.note}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatRelativeTimestamp(zap.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
        <Heart
          className={`${iconSize} transition-colors ${likeIconClass} ${showLikeSpinner ? 'opacity-60' : ''}`}
        />
        <span className={`font-medium transition-colors ${likeCountClass}`}>
          {showLikeSpinner ? (
            <div className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          ) : (
            displayedLikes.toLocaleString()
          )}
        </span>
        <span className={`transition-colors ${likeLabelClass} ${textSize}`}>
          likes
        </span>
      </button>
    </div>
  )
}
