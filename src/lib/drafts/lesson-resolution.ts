import { parseEvent, type NostrEvent } from '@/data/types'
import type { CourseDraft, DraftLesson } from '@/hooks/useCourseDraftQuery'
import type { ResourceNoteResult } from '@/hooks/useResourceNotes'

export type DraftLessonStatus = 'draft' | 'published'

export interface ResolvedDraftLesson {
  id: string
  index: number
  title: string
  summary?: string
  content?: string
  type: string
  isPremium: boolean
  status: DraftLessonStatus
  price?: number
  author?: string
  authorPubkey?: string
  videoUrl?: string
  topics: string[]
  image?: string
  draftId?: string | null
  resourceId?: string | null
}

export interface ResolveDraftLessonResult {
  data: ResolvedDraftLesson | null
  contentNotice?: string
}

export interface DraftLessonListItem {
  id: string
  index: number
  title: string
  isPremium: boolean
  status: DraftLessonStatus
  type: string
  noteError?: string
}

function formatNpubWithEllipsis(pubkey: string | undefined): string {
  if (!pubkey) return 'Anonymous'
  if (pubkey.startsWith('npub')) {
    return `${pubkey.slice(0, 10)}…${pubkey.slice(-8)}`
  }
  return `${pubkey.slice(0, 8)}…${pubkey.slice(-8)}`
}

function coerceNote(note?: NostrEvent | null): NostrEvent | undefined {
  if (!note) return undefined
  if ('sig' in note && typeof note.sig === 'string') {
    return note
  }
  // Some API payloads omit sig. Provide an empty string so parseEvent keeps working.
  return {
    ...note,
    sig: '',
  }
}

export function resolveDraftLesson(
  courseDraft: CourseDraft,
  lesson: DraftLesson,
  noteResult?: ResourceNoteResult
): ResolveDraftLessonResult {
  if (!lesson) {
    return { data: null }
  }

  const resourceId = lesson.resourceId ?? lesson.resource?.id ?? null
  const status: DraftLessonStatus = resourceId ? 'published' : 'draft'

  let title = lesson.draft?.title ?? `Lesson ${lesson.index + 1}`
  let summary = lesson.draft?.summary ?? ''
  let content = lesson.draft?.content ?? ''
  let type = lesson.draft?.type ?? (lesson.resource?.videoUrl ? 'video' : 'document')
  let videoUrl = lesson.draft?.videoUrl ?? lesson.resource?.videoUrl ?? undefined
  let topics = lesson.draft?.topics ?? []
  let price = lesson.draft?.price ?? lesson.resource?.price ?? 0
  let isPremium = price ? price > 0 : false
  let image = lesson.draft?.image ?? undefined
  let author = courseDraft.user?.username ?? lesson.resource?.user?.username ?? undefined
  let authorPubkey = lesson.resource?.user?.pubkey ?? courseDraft.user?.pubkey ?? undefined

  const noteFromResult = noteResult?.note ? coerceNote(noteResult.note) : undefined
  const fallbackNote = coerceNote(lesson.resource?.note as unknown as NostrEvent | null)
  const activeNote = noteFromResult ?? fallbackNote

  if (activeNote) {
    const parsed = parseEvent(activeNote)
    title = parsed.title || title
    summary = parsed.summary || summary
    content = parsed.content || content
    type = parsed.type || type
    videoUrl = parsed.videoUrl || videoUrl
    topics = parsed.topics.length > 0 ? parsed.topics : topics
    image = parsed.image || image

    if (parsed.price) {
      const parsedPrice = Number(parsed.price)
      if (!Number.isNaN(parsedPrice)) {
        price = parsedPrice
        isPremium = parsedPrice > 0
      }
    } else if (parsed.isPremium !== undefined) {
      isPremium = Boolean(parsed.isPremium)
    } else {
      isPremium = (lesson.resource?.price ?? 0) > 0
    }

    if (parsed.author) {
      author = parsed.author
    }
    if (parsed.authorPubkey) {
      authorPubkey = parsed.authorPubkey
    } else if (parsed.pubkey) {
      authorPubkey = parsed.pubkey
    }
  } else if (resourceId) {
    // Ensure we capture price/isPremium from the stored resource when no note returned yet
    price = lesson.resource?.price ?? price
    isPremium = (lesson.resource?.price ?? 0) > 0
    type = lesson.resource?.videoUrl ? 'video' : type
  }

  if (!author) {
    if (authorPubkey) {
      author = formatNpubWithEllipsis(authorPubkey)
    } else if (courseDraft.user?.pubkey) {
      author = formatNpubWithEllipsis(courseDraft.user.pubkey)
    } else {
      author = 'Anonymous'
    }
  }

  const resolved: ResolvedDraftLesson = {
    id: lesson.id,
    index: lesson.index,
    title,
    summary,
    content,
    type,
    isPremium,
    status,
    price,
    author,
    authorPubkey,
    videoUrl,
    topics,
    image,
    draftId: lesson.draftId ?? null,
    resourceId,
  }

  let contentNotice: string | undefined
  if (resourceId && !activeNote && noteResult?.noteError) {
    contentNotice = `Unable to load the published lesson content: ${noteResult.noteError}`
  } else if (resourceId && !activeNote && !content) {
    contentNotice = 'Published lesson content is still propagating on Nostr. Try refreshing in a moment or verify the resource was published successfully.'
  }

  return {
    data: resolved,
    contentNotice,
  }
}

export function buildDraftLessonList(
  courseDraft: CourseDraft,
  resourceNotes: Map<string, ResourceNoteResult>
): DraftLessonListItem[] {
  return [...courseDraft.draftLessons]
    .sort((a, b) => a.index - b.index)
    .map(lesson => {
      const resourceId = lesson.resourceId ?? lesson.resource?.id ?? null
      const noteResult = resourceNotes.get(resourceId ?? '')
      const { data } = resolveDraftLesson(courseDraft, lesson, noteResult)

      return {
        id: lesson.id,
        index: lesson.index,
        title:
          data?.title ||
          lesson.draft?.title ||
          (resourceId ? `Lesson ${lesson.index + 1}` : `Lesson ${lesson.index + 1}`),
        isPremium:
          data?.isPremium ??
          ((lesson.draft?.price ?? lesson.resource?.price ?? 0) > 0),
        status: resourceId ? 'published' : 'draft',
        type: data?.type || lesson.draft?.type || (lesson.resource?.videoUrl ? 'video' : 'document'),
        noteError: noteResult?.noteError,
      }
    })
}
