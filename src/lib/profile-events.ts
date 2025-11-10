/**
 * Client-side profile event helpers used to notify components when the
 * aggregated profile has changed (e.g. after linking accounts or editing
 * profile data). Components like the Header can listen for this event and
 * refresh cached identity information without forcing a full page reload.
 */

export const PROFILE_UPDATED_EVENT = "profile:updated"

export interface ProfileUpdatedDetail {
  name?: string | null
  username?: string | null
  image?: string | null
}

export function dispatchProfileUpdatedEvent(detail?: ProfileUpdatedDetail) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<ProfileUpdatedDetail>(PROFILE_UPDATED_EVENT, {
      detail
    })
  )
}
