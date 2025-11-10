const DIACRITIC_MARKS_REGEX = /[\u0300-\u036f]/g
const DISALLOWED_CHARACTERS_REGEX = /[^a-z0-9._-]/g
const DUPLICATE_SEPARATOR_REGEX = /[-_.]{2,}/g
const LEADING_TRAILING_SEPARATORS_REGEX = /^[-_.]+|[-_.]+$/g
const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 32

/**
 * Normalize arbitrary display names into a slug-style username that matches
 * our database constraints (lowercase, limited punctuation, bounded length).
 * Returns null when the input cannot be converted into a valid username.
 */
export function slugifyUsername(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const ascii = trimmed
    .normalize('NFKD')
    .replace(DIACRITIC_MARKS_REGEX, '')
    .toLowerCase()

  let slug = ascii
    .replace(/\s+/g, '-')
    .replace(DISALLOWED_CHARACTERS_REGEX, '')

  slug = slug
    .replace(DUPLICATE_SEPARATOR_REGEX, (match) => match[0])
    .replace(LEADING_TRAILING_SEPARATORS_REGEX, '')

  if (!slug) {
    return null
  }

  if (slug.length > USERNAME_MAX_LENGTH) {
    slug = slug.slice(0, USERNAME_MAX_LENGTH)
  }

  slug = slug.replace(LEADING_TRAILING_SEPARATORS_REGEX, '')

  if (slug.length < USERNAME_MIN_LENGTH) {
    return null
  }

  if (!USERNAME_PATTERN.test(slug)) {
    return null
  }

  return slug
}

export function isValidUsername(value?: string | null): boolean {
  if (!value) {
    return false
  }
  return (
    value.length >= USERNAME_MIN_LENGTH &&
    value.length <= USERNAME_MAX_LENGTH &&
    USERNAME_PATTERN.test(value)
  )
}
