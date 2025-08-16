/**
 * Profile Data Aggregator
 * 
 * Fetches and aggregates profile data from all linked accounts
 * Respects the profileSource priority (nostr-first vs oauth-first)
 */

import { prisma } from '@/lib/prisma'
import { fetchNostrProfile } from '@/lib/auth'

export interface LinkedAccountData {
  provider: string
  providerAccountId: string
  data: Record<string, any>
  isConnected: boolean
  isPrimary: boolean
}

export interface AggregatedProfile {
  // Core fields with source tracking
  name?: { value: string; source: string }
  email?: { value: string; source: string }
  username?: { value: string; source: string }
  image?: { value: string; source: string }
  banner?: { value: string; source: string }
  about?: { value: string; source: string }
  
  // Social links
  website?: { value: string; source: string }
  github?: { value: string; source: string }
  twitter?: { value: string; source: string }
  location?: { value: string; source: string }
  company?: { value: string; source: string }
  
  // Nostr specific
  pubkey?: { value: string; source: string }
  nip05?: { value: string; source: string }
  lud16?: { value: string; source: string }
  
  // All linked accounts
  linkedAccounts: LinkedAccountData[]
  
  // Metadata
  primaryProvider: string | null
  profileSource: string | null
  totalLinkedAccounts: number
}

/**
 * Fetch GitHub profile data using access token
 */
async function fetchGitHubProfile(accessToken: string): Promise<Record<string, any>> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch GitHub profile:', response.status)
      return {}
    }
    
    const data = await response.json()
    return {
      name: data.name,
      email: data.email,
      username: data.login,
      image: data.avatar_url,
      about: data.bio,
      website: data.blog,
      location: data.location,
      company: data.company,
      twitter: data.twitter_username,
      github: data.login
    }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error)
    return {}
  }
}

/**
 * Aggregate profile data from all linked accounts
 */
export async function getAggregatedProfile(userId: string): Promise<AggregatedProfile> {
  // Fetch user with all linked accounts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true
    }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  // Initialize aggregated profile
  const aggregated: AggregatedProfile = {
    linkedAccounts: [],
    primaryProvider: user.primaryProvider,
    profileSource: user.profileSource,
    totalLinkedAccounts: user.accounts.length
  }
  
  // Process each linked account
  for (const account of user.accounts) {
    const accountData: LinkedAccountData = {
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      data: {},
      isConnected: true,
      isPrimary: account.provider === user.primaryProvider
    }
    
    // Fetch provider-specific data
    switch (account.provider) {
      case 'github':
        if (account.access_token) {
          accountData.data = await fetchGitHubProfile(account.access_token)
        }
        break
        
      case 'nostr':
        if (account.providerAccountId) {
          const nostrProfile = await fetchNostrProfile(account.providerAccountId)
          if (nostrProfile) {
            accountData.data = {
              name: nostrProfile.name,
              username: nostrProfile.name,
              image: nostrProfile.picture,
              banner: nostrProfile.banner,
              about: nostrProfile.about,
              website: nostrProfile.website,
              nip05: nostrProfile.nip05,
              lud16: nostrProfile.lud16,
              location: nostrProfile.location,
              github: nostrProfile.github,
              twitter: nostrProfile.twitter,
              pubkey: account.providerAccountId
            }
          }
        }
        break
        
      case 'email':
        // Email provider only provides email
        accountData.data = {
          email: user.email
        }
        break
    }
    
    aggregated.linkedAccounts.push(accountData)
  }
  
  // Add data from user table (current session data)
  const currentData: LinkedAccountData = {
    provider: 'current',
    providerAccountId: user.id,
    data: {
      name: user.username || undefined,
      username: user.username || undefined,
      email: user.email || undefined,
      image: user.avatar || undefined,
      banner: user.banner || undefined,
      nip05: user.nip05 || undefined,
      lud16: user.lud16 || undefined,
      pubkey: user.pubkey || undefined
    },
    isConnected: true,
    isPrimary: true
  }
  
  // Aggregate fields based on profileSource priority
  const isNostrFirst = user.profileSource === 'nostr' || 
    (!user.profileSource && user.primaryProvider === 'nostr')
  
  // Get prioritized accounts
  const prioritizedAccounts = isNostrFirst
    ? [...aggregated.linkedAccounts.filter(a => a.provider === 'nostr'), currentData, ...aggregated.linkedAccounts.filter(a => a.provider !== 'nostr')]
    : [currentData, ...aggregated.linkedAccounts.filter(a => a.provider !== 'nostr'), ...aggregated.linkedAccounts.filter(a => a.provider === 'nostr')]
  
  // Aggregate each field from prioritized sources
  for (const account of prioritizedAccounts) {
    const source = account.provider === 'current' ? 'profile' : account.provider
    
    // Only set fields if they have values and aren't already set
    if (account.data.name && !aggregated.name) {
      aggregated.name = { value: account.data.name, source }
    }
    if (account.data.email && !aggregated.email) {
      aggregated.email = { value: account.data.email, source }
    }
    if (account.data.username && !aggregated.username) {
      aggregated.username = { value: account.data.username, source }
    }
    if (account.data.image && !aggregated.image) {
      aggregated.image = { value: account.data.image, source }
    }
    if (account.data.banner && !aggregated.banner) {
      aggregated.banner = { value: account.data.banner, source }
    }
    if (account.data.about && !aggregated.about) {
      aggregated.about = { value: account.data.about, source }
    }
    if (account.data.website && !aggregated.website) {
      aggregated.website = { value: account.data.website, source }
    }
    if (account.data.github && !aggregated.github) {
      aggregated.github = { value: account.data.github, source }
    }
    if (account.data.twitter && !aggregated.twitter) {
      aggregated.twitter = { value: account.data.twitter, source }
    }
    if (account.data.location && !aggregated.location) {
      aggregated.location = { value: account.data.location, source }
    }
    if (account.data.company && !aggregated.company) {
      aggregated.company = { value: account.data.company, source }
    }
    if (account.data.pubkey && !aggregated.pubkey) {
      aggregated.pubkey = { value: account.data.pubkey, source }
    }
    if (account.data.nip05 && !aggregated.nip05) {
      aggregated.nip05 = { value: account.data.nip05, source }
    }
    if (account.data.lud16 && !aggregated.lud16) {
      aggregated.lud16 = { value: account.data.lud16, source }
    }
  }
  
  // Also gather all available values for each field (not just the primary)
  for (const account of aggregated.linkedAccounts) {
    const source = account.provider
    
    // Add alternative values to the data structure
    for (const [key, value] of Object.entries(account.data)) {
      if (value && aggregated[key as keyof AggregatedProfile]) {
        // Store alternative sources in the account data
        if (!account.data._alternatives) {
          account.data._alternatives = {}
        }
        account.data._alternatives[key] = { value, source }
      }
    }
  }
  
  return aggregated
}