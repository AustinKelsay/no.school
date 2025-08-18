/**
 * Account Preferences Type Definitions
 * 
 * Centralized type definitions for account preferences to ensure
 * type safety across API routes and client components
 */

import { z } from 'zod'

// Profile source options
export const ProfileSource = {
  NOSTR: 'nostr',
  OAUTH: 'oauth'
} as const

export type ProfileSourceType = typeof ProfileSource[keyof typeof ProfileSource]

// Valid provider types
export const ProviderType = {
  NOSTR: 'nostr',
  GITHUB: 'github',
  EMAIL: 'email',
  ANONYMOUS: 'anonymous',
  CURRENT: 'current'
} as const

export type ProviderTypeValue = typeof ProviderType[keyof typeof ProviderType]

// Zod schemas for validation
export const PreferencesSchema = z.object({
  profileSource: z.enum(['nostr', 'oauth']).optional(),
  primaryProvider: z.string().optional()
})

export const PreferencesUpdateSchema = z.object({
  profileSource: z.enum(['nostr', 'oauth']).optional(),
  primaryProvider: z.string().min(1).optional()
})

// Derived types from schemas
export type PreferencesInput = z.infer<typeof PreferencesSchema>
export type PreferencesUpdate = z.infer<typeof PreferencesUpdateSchema>

// API Response types
export interface PreferencesResponse {
  profileSource: string | null
  primaryProvider: string | null
}

export interface PreferencesSuccessResponse extends PreferencesResponse {
  success: true
}

export interface PreferencesErrorResponse {
  error: string
  details?: z.ZodIssue[]
  status?: number
}

// Type guards
export function isValidProfileSource(value: string): value is ProfileSourceType {
  return value === ProfileSource.NOSTR || value === ProfileSource.OAUTH
}

export function isValidProvider(value: string): value is ProviderTypeValue {
  return Object.values(ProviderType).includes(value as ProviderTypeValue)
}

// Helper function to validate preferences
export function validatePreferences(data: unknown): PreferencesInput | null {
  const result = PreferencesSchema.safeParse(data)
  return result.success ? result.data : null
}

// Helper function to build safe update object
export function buildPreferencesUpdate(data: PreferencesInput): PreferencesUpdate {
  const update: PreferencesUpdate = {}
  
  if (data.profileSource !== undefined && isValidProfileSource(data.profileSource)) {
    update.profileSource = data.profileSource
  }
  
  if (data.primaryProvider !== undefined && data.primaryProvider.length > 0) {
    update.primaryProvider = data.primaryProvider
  }
  
  return update
}