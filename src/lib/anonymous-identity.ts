import { authConfigClient } from "@/lib/auth-config-client"

const anonymousPrefix = authConfigClient.providers?.anonymous?.usernamePrefix || "anon_"
const anonymousAvatarBase = authConfigClient.providers?.anonymous?.defaultAvatar || ""

export function isAnonymousUsername(value?: string | null): boolean {
  return Boolean(value && value.startsWith(anonymousPrefix))
}

export function isAnonymousAvatar(value?: string | null): boolean {
  return Boolean(value && anonymousAvatarBase && value.startsWith(anonymousAvatarBase))
}
