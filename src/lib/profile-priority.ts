export type AccountType = "anonymous" | "nostr" | "oauth"

export function isNostrFirstProfile(
  profileSource?: string | null,
  primaryProvider?: string | null
): boolean {
  return profileSource === "nostr" || (!profileSource && primaryProvider === "nostr")
}

export function getAccountType(
  primaryProvider?: string | null,
  profileSource?: string | null
): AccountType {
  if (primaryProvider === "anonymous") {
    return "anonymous"
  }
  return isNostrFirstProfile(profileSource, primaryProvider) ? "nostr" : "oauth"
}
