'use client'

import { useState, useEffect, useCallback } from 'react'
import { Session } from 'next-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  User, 
  Mail, 
  Key, 
  Globe, 
  MapPin, 
  Github, 
  Twitter,
  ExternalLink,
  Info,
  AlertTriangle,
  Edit,
  Copy,
  Check,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Building,
  Link2
} from 'lucide-react'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ProfileEditForms } from './profile-edit-forms'
import type { AggregatedProfile } from '@/lib/profile-aggregator'

interface EnhancedProfileDisplayProps {
  session: Session
}

// Provider badge colors and labels
const providerConfig = {
  nostr: { label: 'Nostr', color: 'bg-blue-500', icon: Key },
  github: { label: 'GitHub', color: 'bg-gray-800', icon: Github },
  email: { label: 'Email', color: 'bg-green-500', icon: Mail },
  profile: { label: 'Profile', color: 'bg-purple-500', icon: User },
  current: { label: 'Current', color: 'bg-orange-500', icon: User }
}

function ProviderBadge({ source }: { source: string }) {
  const config = providerConfig[source as keyof typeof providerConfig] || {
    label: source,
    color: 'bg-gray-500',
    icon: Link2
  }
  const Icon = config.icon
  
  return (
    <Badge variant="outline" className="text-xs gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export function EnhancedProfileDisplay({ session }: EnhancedProfileDisplayProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [aggregatedProfile, setAggregatedProfile] = useState<AggregatedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user } = session

  // Fetch aggregated profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch('/api/profile/aggregated')
      if (!response.ok) {
        let message = 'Failed to load profile'
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch {}
        throw new Error(message)
      }
      const data = await response.json()
      setAggregatedProfile(data)
    } catch (error) {
      console.error('Failed to fetch aggregated profile:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch aggregated profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const isNostrFirst = aggregatedProfile?.profileSource === 'nostr' || 
    (!aggregatedProfile?.profileSource && aggregatedProfile?.primaryProvider === 'nostr')
  const canSignEvents = !!user.privkey

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(56)}`
  }

  /**
   * Normalize and validate an external website URL.
   * Ensures the URL uses http/https and returns a fully-qualified URL string.
   * Returns null when the value is invalid or unsafe.
   */
  function normalizeExternalUrl(raw: string): string | null {
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (!value) return null
    try {
      const direct = new URL(value)
      if (direct.protocol === 'http:' || direct.protocol === 'https:') return direct.toString()
      return null
    } catch {}
    try {
      const withHttps = new URL(`https://${value}`)
      if (withHttps.protocol === 'http:' || withHttps.protocol === 'https:') return withHttps.toString()
      return null
    } catch {
      return null
    }
  }

  if (showEditForm) {
    return <ProfileEditForms session={session} onClose={() => setShowEditForm(false)} />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const profile = aggregatedProfile || {
    name: user.name ? { value: user.name, source: 'current' } : undefined,
    email: user.email ? { value: user.email, source: 'current' } : undefined,
    username: user.username ? { value: user.username, source: 'current' } : undefined,
    image: user.image ? { value: user.image, source: 'current' } : undefined,
    linkedAccounts: [],
    primaryProvider: null,
    profileSource: null,
    totalLinkedAccounts: 0
  }

  const websiteHref = profile.website ? normalizeExternalUrl(profile.website.value) : null

  return (
    <div className="space-y-6">
      {/* Error State */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unable to load profile</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={fetchProfile} disabled={loading}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage 
                  src={profile.image?.value || user.image || undefined} 
                  alt={profile.name?.value || user.name || 'User'} 
                />
                <AvatarFallback>
                  {(profile.name?.value || user.name || user.username || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl sm:text-2xl">
                    {profile.name?.value || user.name || user.username || 'Unknown User'}
                  </CardTitle>
                  {profile.name && <ProviderBadge source={profile.name.source} />}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={isNostrFirst ? "default" : "secondary"}>
                    {isNostrFirst ? '🔵 Nostr-First' : '🟠 OAuth-First'}
                  </Badge>
                  {canSignEvents && (
                    <Badge variant="outline">
                      <Zap className="mr-1 h-3 w-3" />
                      Can Sign Events
                    </Badge>
                  )}
                  {profile.totalLinkedAccounts > 0 && (
                    <Badge variant="outline">
                      <Link2 className="mr-1 h-3 w-3" />
                      {profile.totalLinkedAccounts} Linked
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowEditForm(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Banner Image */}
      {profile.banner && (
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <OptimizedImage
                src={profile.banner.value}
                alt="Profile Banner"
                width={800}
                height={200}
                className="aspect-[4/1] w-full rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2">
                <ProviderBadge source={profile.banner.source} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.name && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Name:</span>
                  <span className="text-muted-foreground">{profile.name.value}</span>
                  <ProviderBadge source={profile.name.source} />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.name!.value, 'name')}
                >
                  {copiedField === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            {profile.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-muted-foreground">{profile.email.value}</span>
                  <ProviderBadge source={profile.email.source} />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.email!.value, 'email')}
                >
                  {copiedField === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {profile.username && profile.username.value !== profile.name?.value && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Username:</span>
                  <span className="text-muted-foreground">{profile.username.value}</span>
                  <ProviderBadge source={profile.username.source} />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.username!.value, 'username')}
                >
                  {copiedField === 'username' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-muted-foreground">{profile.location.value}</span>
                  <ProviderBadge source={profile.location.source} />
                </div>
              </div>
            )}

            {profile.company && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span className="text-muted-foreground">{profile.company.value}</span>
                  <ProviderBadge source={profile.company.source} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nostr Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Nostr Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.pubkey && (
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="block font-medium">Public Key</span>
                    <ProviderBadge source={profile.pubkey.source} />
                  </div>
                  <code className="block text-sm text-muted-foreground font-mono break-all">
                    {formatKey(profile.pubkey.value)}
                  </code>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.pubkey!.value, 'pubkey')}
                >
                  {copiedField === 'pubkey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {profile.nip05 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-muted-foreground">{profile.nip05.value}</span>
                  <ProviderBadge source={profile.nip05.source} />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.nip05!.value, 'nip05')}
                >
                  {copiedField === 'nip05' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {profile.lud16 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">{profile.lud16.value}</span>
                  <ProviderBadge source={profile.lud16.source} />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(profile.lud16!.value, 'lud16')}
                >
                  {copiedField === 'lud16' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {user.privkey && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Private Key</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {showPrivateKey && (
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-muted-foreground font-mono break-all">
                      {formatKey(user.privkey)}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(user.privkey!, 'privkey')}
                    >
                      {copiedField === 'privkey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Extended Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Extended Profile
          </CardTitle>
          <CardDescription>
            Combined information from all your linked accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* About/Bio */}
            {profile.about && (
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">About</h4>
                  <ProviderBadge source={profile.about.source} />
                </div>
                <p className="text-muted-foreground">
                  {profile.about.value}
                </p>
              </div>
            )}

            {/* Website */}
            {profile.website && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4" />
                  <ProviderBadge source={profile.website.source} />
                </div>
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {profile.website.value}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">{profile.website.value || 'Invalid URL'}</span>
                )}
              </div>
            )}

            {/* GitHub */}
            {profile.github && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Github className="h-4 w-4" />
                  <ProviderBadge source={profile.github.source} />
                </div>
                <a 
                  href={`https://github.com/${profile.github.value}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  @{profile.github.value}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}

            {/* Twitter */}
            {profile.twitter && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Twitter className="h-4 w-4" />
                  <ProviderBadge source={profile.twitter.source} />
                </div>
                <a 
                  href={`https://twitter.com/${profile.twitter.value}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  @{profile.twitter.value}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Linked Accounts Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            All accounts connected to your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {profile.linkedAccounts.map((account) => (
              <div key={`${account.provider}-${account.providerAccountId}`} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${providerConfig[account.provider as keyof typeof providerConfig]?.color || 'bg-gray-500'} bg-opacity-10`}>
                    {(() => {
                      const Icon = providerConfig[account.provider as keyof typeof providerConfig]?.icon || Link2
                      return <Icon className="h-4 w-4" />
                    })()}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {providerConfig[account.provider as keyof typeof providerConfig]?.label || account.provider}
                      {account.isPrimary && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {account.data.name || account.data.email || account.providerAccountId.substring(0, 16) + '...'}
                    </div>
                  </div>
                </div>
                <Badge variant={account.isConnected ? "default" : "secondary"}>
                  {account.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Configuration</CardTitle>
          <CardDescription>
            Details about your account type and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span className="font-medium">Primary Provider:</span>
              <span className="text-muted-foreground">
                {profile.primaryProvider ? providerConfig[profile.primaryProvider as keyof typeof providerConfig]?.label || profile.primaryProvider : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Profile Source:</span>
              <span className="text-muted-foreground">
                {profile.profileSource === 'nostr' ? 'Nostr (Decentralized)' : 
                 profile.profileSource === 'oauth' ? 'OAuth Provider' : 
                 'Default'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account Type:</span>
              <span className="text-muted-foreground">
                {isNostrFirst ? 'Nostr-First Account' : 'OAuth-First Account'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Key Custody:</span>
              <span className="text-muted-foreground">
                {!user.privkey ? 'User Controlled (NIP07)' : 'Platform Managed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Can Sign Events:</span>
              <span className="text-muted-foreground">
                {canSignEvents ? 'Yes' : 'No (External signing required)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Linked Accounts:</span>
              <span className="text-muted-foreground">
                {profile.totalLinkedAccounts}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}