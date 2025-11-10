const STORAGE_KEY = "ns.auth.persisted-anonymous"

export type PersistedAnonymousIdentity = {
  privkey: string
  pubkey?: string
  userId?: string
  updatedAt: number
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

/**
 * Read the cached anonymous identity (privkey + metadata) from browser storage.
 * Returns null if no usable record exists or the payload is malformed.
 */
export function getPersistedAnonymousIdentity(): PersistedAnonymousIdentity | null {
  if (!isBrowser()) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as PersistedAnonymousIdentity
    if (!parsed?.privkey || typeof parsed.privkey !== "string") {
      return null
    }

    return parsed
  } catch (error) {
    console.warn("Failed to read persisted anonymous identity:", error)
    return null
  }
}

/**
 * Persist the anonymous identity so future anon sign-ins can reuse the same account.
 * We intentionally keep minimal metadata (pubkey/userId) for basic validation UX.
 */
export function persistAnonymousIdentity(payload: {
  privkey: string
  pubkey?: string
  userId?: string
}) {
  if (!isBrowser() || !payload.privkey) {
    return
  }

  try {
    const record: PersistedAnonymousIdentity = {
      privkey: payload.privkey,
      pubkey: payload.pubkey,
      userId: payload.userId,
      updatedAt: Date.now()
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch (error) {
    console.warn("Failed to persist anonymous identity:", error)
  }
}

/**
 * Remove the cached identity (e.g., when a stored key stops working or the user resets).
 */
export function clearPersistedAnonymousIdentity() {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn("Failed to clear persisted anonymous identity:", error)
  }
}
