import { prisma } from '@/lib/prisma'
import { getRelays } from '@/lib/nostr-relays'
import {
  createCourseEvent,
  createResourceEvent,
  extractNoteId,
  isNip07User,
} from '@/lib/nostr-events'
import type { Course, Resource } from '@prisma/client'
import { RelayPool, type NostrEvent } from 'snstr'

type RelaySet = 'default' | 'content' | 'profile' | 'zapThreads'

export class RepublishError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'RepublishError'
  }
}

interface BaseRepublishOptions {
  relays?: string[]
  relaySet?: RelaySet
  signedEvent?: NostrEvent
  privkey?: string
}

export interface RepublishResourceOptions extends BaseRepublishOptions {
  title: string
  summary: string
  content: string
  price: number
  image?: string
  topics: string[]
  additionalLinks: string[]
  type: 'document' | 'video'
  videoUrl?: string
}

export interface RepublishCourseOptions extends BaseRepublishOptions {
  title: string
  summary: string
  image?: string
  price: number
  topics: string[]
}

interface PublishOutcome {
  event: NostrEvent
  noteId: string
  publishedRelays: string[]
  mode: 'server-sign' | 'signed-event'
}

async function publishToRelays(relays: string[], event: NostrEvent): Promise<string[]> {
  if (!relays || relays.length === 0) {
    throw new RepublishError('No relays configured for publishing', 'NO_RELAYS')
  }

  const relayPool = new RelayPool(relays)
  const publishResults = await Promise.allSettled(relayPool.publish(relays, event))

  const successfulRelays: string[] = []
  publishResults.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      successfulRelays.push(relays[idx])
    }
  })

  if (successfulRelays.length === 0) {
    throw new RepublishError('Failed to publish event to relays', 'RELAY_PUBLISH_FAILED', {
      results: publishResults,
    })
  }

  return successfulRelays
}

async function assertActorCanManageResource(resource: Resource & { user: { id: string } }, actorId: string) {
  if (resource.userId === actorId) {
    return
  }

  const actingUser = await prisma.user.findUnique({
    where: { id: actorId },
    include: { role: true },
  })

  if (!actingUser) {
    throw new RepublishError('Acting user not found', 'ACTOR_NOT_FOUND')
  }

  if (!actingUser?.role?.admin) {
    throw new RepublishError('Access denied', 'FORBIDDEN')
  }
}

async function assertActorCanManageCourse(course: Course & { user: { id: string } }, actorId: string) {
  if (course.userId === actorId) {
    return
  }

  const actingUser = await prisma.user.findUnique({
    where: { id: actorId },
    include: { role: true },
  })

  if (!actingUser) {
    throw new RepublishError('Acting user not found', 'ACTOR_NOT_FOUND')
  }

  if (!actingUser?.role?.admin) {
    throw new RepublishError('Access denied', 'FORBIDDEN')
  }
}

export class RepublishService {
  static async republishResource(
    resourceId: string,
    actorUserId: string,
    options: RepublishResourceOptions
  ): Promise<PublishOutcome> {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        user: {
          include: {
            accounts: true,
            role: true,
          },
        },
      },
    })

    if (!resource || !resource.user) {
      throw new RepublishError('Resource not found', 'NOT_FOUND')
    }

    if (!resource.user.pubkey) {
      throw new RepublishError('Resource owner missing Nostr pubkey', 'MISSING_PUBKEY')
    }

    await assertActorCanManageResource(resource, actorUserId)

    const { signedEvent, privkey, relays, relaySet, ...payload } = options
    const selectedRelays = relays && relays.length > 0 ? relays : getRelays(relaySet ?? 'default')

    if (signedEvent) {
      const dTag = signedEvent.tags.find(tag => tag[0] === 'd')
      if (!dTag || dTag[1] !== resourceId) {
        throw new RepublishError('Signed event must include matching d tag', 'INVALID_D_TAG')
      }

      if (signedEvent.pubkey !== resource.user.pubkey) {
        throw new RepublishError('Signed event must be signed by resource owner', 'INVALID_PUBKEY')
      }

      const publishedRelays = await publishToRelays(selectedRelays, signedEvent)

      await prisma.$transaction(async tx => {
        await tx.resource.update({
          where: { id: resourceId },
          data: {
            price: payload.price,
            noteId: signedEvent.id,
            videoUrl: payload.type === 'video' ? payload.videoUrl ?? null : null,
          },
        })
      })

      return {
        event: signedEvent,
        noteId: signedEvent.id,
        publishedRelays,
        mode: 'signed-event',
      }
    }

    const ownerAccounts = resource.user.accounts
    const ownerIsNip07 = ownerAccounts.some(account => isNip07User(account.provider))
    const signingPrivkey = privkey || resource.user.privkey

    if (!signingPrivkey) {
      if (ownerIsNip07) {
        throw new RepublishError(
          'Private key required to republish this resource',
          'PRIVKEY_REQUIRED'
        )
      }
      throw new RepublishError('Private key unavailable for server-side signing', 'PRIVKEY_REQUIRED')
    }

    const draftLike = {
      id: resourceId,
      userId: resource.userId,
      type: payload.type,
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      image: payload.image,
      price: payload.price,
      topics: payload.topics,
      additionalLinks: payload.additionalLinks,
      videoUrl: payload.type === 'video' ? payload.videoUrl : undefined,
    }

    const event = createResourceEvent(draftLike as any, signingPrivkey)
    const noteId = extractNoteId(event)

    if (!noteId || noteId !== resourceId) {
      throw new RepublishError('Generated event missing matching d tag', 'INVALID_EVENT')
    }

    const publishedRelays = await publishToRelays(selectedRelays, event)

    await prisma.$transaction(async tx => {
      await tx.resource.update({
        where: { id: resourceId },
        data: {
          price: payload.price,
          noteId: event.id,
          videoUrl: payload.type === 'video' ? payload.videoUrl ?? null : null,
        },
      })
    })

    return {
      event,
      noteId: event.id,
      publishedRelays,
      mode: 'server-sign',
    }
  }

  static async republishCourse(
    courseId: string,
    actorUserId: string,
    options: RepublishCourseOptions
  ): Promise<PublishOutcome> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        user: {
          include: {
            accounts: true,
            role: true,
          },
        },
        lessons: {
          orderBy: { index: 'asc' },
          include: {
            resource: {
              include: {
                user: {
                  select: {
                    pubkey: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!course || !course.user) {
      throw new RepublishError('Course not found', 'NOT_FOUND')
    }

    if (!course.user.pubkey) {
      throw new RepublishError('Course owner missing Nostr pubkey', 'MISSING_PUBKEY')
    }

    await assertActorCanManageCourse(course, actorUserId)

    const { signedEvent, privkey, relays, relaySet, ...payload } = options
    const selectedRelays = relays && relays.length > 0 ? relays : getRelays(relaySet ?? 'default')

    const lessonReferences = course.lessons
      .map(lesson => {
        if (!lesson.resourceId || !lesson.resource?.user?.pubkey) {
          return null
        }
        return {
          resourceId: lesson.resourceId,
          pubkey: lesson.resource.user.pubkey,
        }
      })
      .filter(Boolean) as Array<{ resourceId: string; pubkey: string }>

    if (lessonReferences.length === 0) {
      throw new RepublishError(
        'Course must reference at least one published lesson',
        'MISSING_LESSONS'
      )
    }

    if (signedEvent) {
      const dTag = signedEvent.tags.find(tag => tag[0] === 'd')
      if (!dTag || dTag[1] !== courseId) {
        throw new RepublishError('Signed event must include matching d tag', 'INVALID_D_TAG')
      }

      if (signedEvent.pubkey !== course.user.pubkey) {
        throw new RepublishError('Signed event must be signed by course owner', 'INVALID_PUBKEY')
      }

      const publishedRelays = await publishToRelays(selectedRelays, signedEvent)

      await prisma.$transaction(async tx => {
        await tx.course.update({
          where: { id: courseId },
          data: {
            price: payload.price,
            noteId: signedEvent.id,
          },
        })
      })

      return {
        event: signedEvent,
        noteId: signedEvent.id,
        publishedRelays,
        mode: 'signed-event',
      }
    }

    const ownerAccounts = course.user.accounts
    const ownerIsNip07 = ownerAccounts.some(account => isNip07User(account.provider))
    const signingPrivkey = privkey || course.user.privkey

    if (!signingPrivkey) {
      if (ownerIsNip07) {
        throw new RepublishError(
          'Private key required to republish this course',
          'PRIVKEY_REQUIRED'
        )
      }
      throw new RepublishError('Private key unavailable for server-side signing', 'PRIVKEY_REQUIRED')
    }

    const draftLike = {
      id: courseId,
      userId: course.userId,
      title: payload.title,
      summary: payload.summary,
      image: payload.image,
      price: payload.price,
      topics: payload.topics,
    }

    const event = createCourseEvent(draftLike as any, lessonReferences, signingPrivkey)
    const noteId = extractNoteId(event)

    if (!noteId || noteId !== courseId) {
      throw new RepublishError('Generated event missing matching d tag', 'INVALID_EVENT')
    }

    const publishedRelays = await publishToRelays(selectedRelays, event)

    await prisma.$transaction(async tx => {
      await tx.course.update({
        where: { id: courseId },
        data: {
          price: payload.price,
          noteId: event.id,
        },
      })
    })

    return {
      event,
      noteId: event.id,
      publishedRelays,
      mode: 'server-sign',
    }
  }
}
