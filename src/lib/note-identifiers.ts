import type { NostrEvent } from "snstr"
import { encodeAddress, encodeEvent, encodeNoteId } from "snstr"

const HEX_64_REGEX = /^[0-9a-f]{64}$/i

function getDTagValue(note?: NostrEvent | null): string | undefined {
  if (!note?.tags) return undefined
  const dTag = note.tags.find(tag => tag[0] === "d" && typeof tag[1] === "string" && tag[1].length > 0)
  return dTag?.[1]
}

export function formatNoteIdentifier(note?: NostrEvent | null, fallbackId?: string | null): string | undefined {
  if (note) {
    const identifier = getDTagValue(note)
    if (identifier) {
      try {
        return encodeAddress({
          identifier,
          kind: note.kind,
          pubkey: note.pubkey,
        })
      } catch (error) {
        console.error("Failed to encode naddr", error)
      }
    }

    try {
      return encodeEvent({
        id: note.id,
        author: note.pubkey,
        kind: note.kind,
      })
    } catch (error) {
      console.error("Failed to encode nevent", error)
    }
  }

  if (!fallbackId) return undefined

  const trimmedFallback = fallbackId.trim()
  if (trimmedFallback.startsWith("naddr") || trimmedFallback.startsWith("nevent") || trimmedFallback.startsWith("note")) {
    return trimmedFallback
  }

  if (HEX_64_REGEX.test(trimmedFallback)) {
    try {
      return encodeNoteId(trimmedFallback.toLowerCase())
    } catch (error) {
      console.error("Failed to encode noteId to bech32", error)
    }
  }

  return trimmedFallback
}
