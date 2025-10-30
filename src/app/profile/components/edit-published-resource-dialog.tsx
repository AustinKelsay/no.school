'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, X } from 'lucide-react'
import { useRepublishResourceMutation } from '@/hooks/usePublishedContentMutations'
import { createUnsignedResourceEvent } from '@/lib/nostr-events'
import { hasNip07Support, type NostrEvent } from 'snstr'

export type ResourceEditData = {
  id: string
  title: string
  summary: string
  content: string
  price: number
  image?: string
  topics: string[]
  additionalLinks: string[]
  type: 'document' | 'video'
  videoUrl?: string
  pubkey?: string
}

type EditPublishedResourceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: ResourceEditData
  onSuccess?: () => void
}

export function EditPublishedResourceDialog({
  open,
  onOpenChange,
  data,
  onSuccess,
}: EditPublishedResourceDialogProps) {
  const mutation = useRepublishResourceMutation()
  const [error, setError] = useState<string | null>(null)
  const [topicInput, setTopicInput] = useState('')
  const [linkInput, setLinkInput] = useState('')

  const [formState, setFormState] = useState<ResourceEditData | null>(data ?? null)

  useEffect(() => {
    if (data) {
      setFormState(data)
      setTopicInput('')
      setLinkInput('')
      setError(null)
    }
  }, [data, open])

  const isVideo = formState?.type === 'video'

  const displayTopics = useMemo(() => {
    if (!formState) return []
    return formState.topics.map(topic => topic.trim()).filter(Boolean)
  }, [formState])

  const displayLinks = useMemo(() => {
    if (!formState) return []
    return formState.additionalLinks.map(link => link.trim()).filter(Boolean)
  }, [formState])

  const attemptNip07Republish = async (): Promise<boolean> => {
    if (!formState) return false

    if (!hasNip07Support()) {
      setError('Nostr extension not available for signing.')
      return false
    }

    try {
      const pubkey = await (window as any).nostr.getPublicKey()
      if (!pubkey) {
        setError('Unable to retrieve pubkey from Nostr extension.')
        return false
      }

      if (formState.pubkey && formState.pubkey !== pubkey) {
        setError('Active Nostr key does not match the original publisher.')
        return false
      }

      const draftLike = {
        id: formState.id,
        userId: '',
        type: formState.type,
        title: formState.title.trim(),
        summary: formState.summary.trim(),
        content: formState.content,
        image: formState.image?.trim() || undefined,
        price: Number.isFinite(formState.price) ? formState.price : 0,
        topics: displayTopics,
        additionalLinks: displayLinks,
        videoUrl:
          formState.type === 'video' ? formState.videoUrl?.trim() || undefined : undefined,
      }

      const unsignedEvent = createUnsignedResourceEvent(draftLike as any, pubkey)
      const signedEvent: NostrEvent = await (window as any).nostr.signEvent(unsignedEvent)

      await mutation.mutateAsync({
        id: formState.id,
        data: {
          title: formState.title.trim(),
          summary: formState.summary.trim(),
          content: formState.content,
          price: Number.isFinite(formState.price) ? formState.price : 0,
          image: formState.image?.trim() || undefined,
          topics: displayTopics,
          additionalLinks: displayLinks,
          type: formState.type,
          videoUrl:
            formState.type === 'video' ? formState.videoUrl?.trim() || undefined : undefined,
          signedEvent,
        },
      })

      onSuccess?.()
      onOpenChange(false)
      return true
    } catch (signError) {
      const message =
        signError instanceof Error ? signError.message : 'Failed to sign event with Nostr'
      setError(message)
      return false
    }
  }

  const handleAddTopic = () => {
    if (!formState) return
    const value = topicInput.trim()
    if (!value) return

    setFormState(prev =>
      prev
        ? {
            ...prev,
            topics: Array.from(new Set([...prev.topics, value])),
          }
        : prev
    )
    setTopicInput('')
  }

  const handleRemoveTopic = (topic: string) => {
    setFormState(prev =>
      prev
        ? {
            ...prev,
            topics: prev.topics.filter(item => item !== topic),
          }
        : prev
    )
  }

  const handleAddLink = () => {
    if (!formState) return
    const value = linkInput.trim()
    if (!value) return

    setFormState(prev =>
      prev
        ? {
            ...prev,
            additionalLinks: Array.from(new Set([...prev.additionalLinks, value])),
          }
        : prev
    )
    setLinkInput('')
  }

  const handleRemoveLink = (link: string) => {
    setFormState(prev =>
      prev
        ? {
            ...prev,
            additionalLinks: prev.additionalLinks.filter(item => item !== link),
          }
        : prev
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState) return

    if (!formState.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formState.summary.trim()) {
      setError('Summary is required')
      return
    }

    if (isVideo && !formState.videoUrl?.trim()) {
      setError('Video URL is required for video content')
      return
    }

    setError(null)

    try {
      await mutation.mutateAsync({
        id: formState.id,
        data: {
          title: formState.title.trim(),
          summary: formState.summary.trim(),
          content: formState.content,
          price: Number.isFinite(formState.price) ? formState.price : 0,
          image: formState.image?.trim() || undefined,
          topics: displayTopics,
          additionalLinks: displayLinks,
          type: formState.type,
          videoUrl: isVideo ? formState.videoUrl?.trim() || undefined : undefined,
        },
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error) {
        const code = (err as Error & { code?: string }).code
        if (code === 'PRIVKEY_REQUIRED') {
          setError(null)
          const succeeded = await attemptNip07Republish()
          if (succeeded) {
            return
          }
          setError(
            `${err.message}. Provide a freshly signed Nostr event or the owner's private key to continue.`
          )
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to update resource')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Published Resource</DialogTitle>
          <DialogDescription>
            Update the metadata and content, then we will republish this replaceable event on
            Nostr with the same identifier.
          </DialogDescription>
        </DialogHeader>

        {!formState ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Title</Label>
                <Input
                  id="resource-title"
                  value={formState.title}
                  onChange={event =>
                    setFormState(prev => (prev ? { ...prev, title: event.target.value } : prev))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-summary">Summary</Label>
                <Textarea
                  id="resource-summary"
                  rows={3}
                  value={formState.summary}
                  onChange={event =>
                    setFormState(prev => (prev ? { ...prev, summary: event.target.value } : prev))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="resource-price">Price (sats)</Label>
                  <Input
                    id="resource-price"
                    type="number"
                    min={0}
                    value={Number.isFinite(formState.price) ? formState.price : 0}
                    onChange={event =>
                      setFormState(prev =>
                        prev
                          ? { ...prev, price: Number.parseInt(event.target.value, 10) || 0 }
                          : prev
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-image">Image URL</Label>
                  <Input
                    id="resource-image"
                    value={formState.image ?? ''}
                    onChange={event =>
                      setFormState(prev =>
                        prev ? { ...prev, image: event.target.value } : prev
                      )
                    }
                  />
                </div>
              </div>

              {isVideo && (
                <div className="space-y-2">
                  <Label htmlFor="resource-video">Video URL</Label>
                  <Input
                    id="resource-video"
                    value={formState.videoUrl ?? ''}
                    onChange={event =>
                      setFormState(prev =>
                        prev ? { ...prev, videoUrl: event.target.value } : prev
                      )
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  {isVideo ? 'Supporting Markdown' : 'Content'}
                  {isVideo && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (body content shown below the embedded video)
                    </span>
                  )}
                </Label>
                <Textarea
                  rows={8}
                  value={formState.content}
                  onChange={event =>
                    setFormState(prev =>
                      prev ? { ...prev, content: event.target.value } : prev
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Topics</Label>
                <div className="flex gap-2">
                  <Input
                    value={topicInput}
                    onChange={event => setTopicInput(event.target.value)}
                    placeholder="Add new topic"
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleAddTopic()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTopic}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {displayTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayTopics.map(topic => (
                      <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                        #{topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(topic)}
                          className="ml-1 focus:outline-none"
                          aria-label={`Remove ${topic}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No topics added yet.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Additional Links</Label>
                <div className="flex gap-2">
                  <Input
                    value={linkInput}
                    onChange={event => setLinkInput(event.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleAddLink()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddLink}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
                {displayLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayLinks.map(link => (
                      <Badge key={link} variant="outline" className="flex items-center gap-1">
                        {link}
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link)}
                          className="ml-1 focus:outline-none"
                          aria-label={`Remove ${link}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No extra links provided.</p>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
              <p className="text-xs text-muted-foreground">
                We will republish this replaceable event with an updated signature while keeping the
                same <code>d</code> tag so clients receive the latest version.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
