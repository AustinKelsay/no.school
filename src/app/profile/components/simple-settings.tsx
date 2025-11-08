'use client'

import { useState, useEffect, useTransition } from 'react'
import { Session } from 'next-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Loader2, 
  AlertTriangle, 
  Key,
  Mail,
  Github,
  RefreshCw
} from 'lucide-react'
import { updateBasicProfile, updateEnhancedProfile, type BasicProfileData, type EnhancedProfileData, type SignedKind0Event } from '../actions'
import { useToast } from '@/hooks/use-toast'
import type { NostrEvent } from 'snstr'
import { InfoTooltip } from '@/components/ui/info-tooltip'

interface SimpleSettingsProps {
  session: Session
}

const fieldHelp = {
  accountType: 'Explains whether your profile is driven by Nostr data or managed directly inside the app.',
  basicName: 'Displayed on your profile when OAuth providers are authoritative. Nostr-first users must edit it via their Nostr profile.',
  basicEmail: 'Used for authentication and notifications. It is never shown to other users.',
  enhancedProfile: 'Nostr metadata (NIP-05, Lightning, banner) that accompanies your public profile.',
  nip05: 'DNS-based identifier (user@domain.com) that maps to your Nostr public key.',
  lud16: 'Lightning address that fans can use to send you tips.',
  banner: 'Hero image that appears at the top of your profile.',
  profileSource: 'Determines which provider wins when multiple accounts provide the same field.',
  syncProfile: 'Manually pull the latest data from a specific provider without waiting for background jobs.'
}

export function SimpleSettings({ session }: SimpleSettingsProps) {
  const { user } = session
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form states
  const [basicProfile, setBasicProfile] = useState<BasicProfileData>({
    name: user.name || '',
    email: user.email || ''
  })

  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedProfileData>({
    nip05: user.nip05 || '',
    lud16: user.lud16 || '',
    banner: user.banner || ''
  })

  const [preferences, setPreferences] = useState({
    profileSource: 'oauth',
    primaryProvider: ''
  })

  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([])
  const [nostrProfile, setNostrProfile] = useState<Record<string, any> | null>(null)
  const [nostrProfileStatus, setNostrProfileStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    user.pubkey ? 'loading' : 'success'
  )
  
  // Tracks initial data loading errors so users get visible feedback
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null)

  // Determine account type
  const isNostrFirst = !user.privkey
  const canEditBasic = !isNostrFirst

  // Fetch preferences and linked accounts. Surfaces any failures to the UI.
  useEffect(() => {
    async function fetchData() {
      const errors: string[] = []

      // Preferences
      try {
        const prefResponse = await fetch('/api/account/preferences')
        if (prefResponse.ok) {
          const prefs = await prefResponse.json()
          setPreferences({
            profileSource: prefs.profileSource || 'oauth',
            primaryProvider: prefs.primaryProvider || ''
          })
        } else {
          const err = await prefResponse.json().catch(() => ({}))
          errors.push(err?.error || 'Failed to load account preferences')
        }
      } catch {
        errors.push('Failed to load account preferences')
      }

      // Linked accounts
      try {
        const linkedResponse = await fetch('/api/account/linked')
        if (linkedResponse.ok) {
          const accounts = await linkedResponse.json()
          setLinkedAccounts(accounts)
        } else {
          const err = await linkedResponse.json().catch(() => ({}))
          errors.push(err?.error || 'Failed to load linked accounts')
        }
      } catch {
        errors.push('Failed to load linked accounts')
      }

      if (user.pubkey) {
        setNostrProfileStatus('loading')
        try {
          const nostrResponse = await fetch('/api/profile/nostr')
          if (nostrResponse.ok) {
            const data = await nostrResponse.json()
            if (data?.profile) {
              setNostrProfile(data.profile)
              setEnhancedProfile(prev => ({
                nip05: prev.nip05 || data.profile.nip05 || '',
                lud16: prev.lud16 || data.profile.lud16 || '',
                banner: prev.banner || data.profile.banner || ''
              }))
            }
            setNostrProfileStatus('success')
          } else {
            setNostrProfileStatus('error')
            errors.push('Failed to load Nostr profile metadata')
          }
        } catch {
          setNostrProfileStatus('error')
          errors.push('Failed to load Nostr profile metadata')
        }
      } else {
        setNostrProfileStatus('success')
      }

      if (errors.length > 0) setInitialLoadError(errors.join(' · '))
    }

    fetchData()
  }, [user.pubkey])

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEditBasic) return

    startTransition(async () => {
      const result = await updateBasicProfile(basicProfile)
      
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your basic profile has been updated successfully.'
        })
      } else {
        toast({
          title: 'Update Failed',
          description: result.message,
          variant: 'destructive'
        })
      }
    })
  }

  const handleEnhancedSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedProfile = {
      nip05: String(enhancedProfile.nip05 ?? '').trim(),
      lud16: String(enhancedProfile.lud16 ?? '').trim(),
      banner: String(enhancedProfile.banner ?? '').trim()
    }
    setEnhancedProfile(normalizedProfile)

    const shouldSignWithExtension =
      isNostrFirst &&
      typeof window !== 'undefined' &&
      Boolean((window as any).nostr?.signEvent) &&
      Boolean(user.pubkey)

    if (isNostrFirst && !shouldSignWithExtension) {
      toast({
        title: 'Nostr Extension Required',
        description:
          'Connect a Nostr browser extension (NIP-07) to update your on-chain profile metadata.',
        variant: 'destructive'
      })
      return
    }

    if (shouldSignWithExtension) {
      if (nostrProfileStatus === 'loading') {
        toast({
          title: 'Still Loading Profile',
          description: 'Fetching your Nostr metadata; please try again in a moment.',
          variant: 'destructive'
        })
        return
      }

      if (nostrProfileStatus === 'error' && !nostrProfile) {
        toast({
          title: 'Nostr Metadata Unavailable',
          description: 'We could not load your existing profile from relays. Please retry syncing or refresh before publishing to avoid losing data.',
          variant: 'destructive'
        })
        return
      }
    }

    const prepareSignedEvent = async (): Promise<SignedKind0Event | undefined> => {
      if (!shouldSignWithExtension) {
        return undefined
      }

      try {
        const baseProfile: Record<string, any> = nostrProfile
          ? { ...nostrProfile }
          : {}

        const applyField = (key: 'nip05' | 'lud16' | 'banner') => {
          const value = normalizedProfile[key]
          if (value) {
            baseProfile[key] = value
          } else if (value === '') {
            delete baseProfile[key]
          }
        }

        applyField('nip05')
        applyField('lud16')
        applyField('banner')

        if (!baseProfile.name && user.name) {
          baseProfile.name = user.name
        }
        if (!baseProfile.display_name && user.name) {
          baseProfile.display_name = user.name
        }
        const profilePicture = user.image ?? user.avatar
        if (!baseProfile.picture && profilePicture) {
          baseProfile.picture = profilePicture
        }

        const unsignedEvent = {
          kind: 0,
          tags: [],
          content: JSON.stringify(baseProfile),
          created_at: Math.floor(Date.now() / 1000),
          pubkey: user.pubkey
        }

        const signed: NostrEvent = await (window as any).nostr.signEvent(unsignedEvent)
        setNostrProfile(baseProfile)
        return signed as SignedKind0Event
      } catch (error) {
        toast({
          title: 'Signing Failed',
          description:
            error instanceof Error
              ? error.message
              : 'Unable to sign profile update with your Nostr extension.',
          variant: 'destructive'
        })
        throw error
      }
    }

    startTransition(async () => {
      let signedEvent: SignedKind0Event | undefined
      try {
        signedEvent = await prepareSignedEvent()
      } catch {
        return
      }

      const result = await updateEnhancedProfile({
        ...normalizedProfile,
        signedEvent
      })
      
      if (result.success) {
        const description = result.publishedToNostr
          ? 'Your enhanced profile has been updated successfully.'
          : 'Profile saved locally. Update your Nostr relays to keep metadata in sync.'
        toast({
          title: 'Profile Updated',
          description
        })
        if (result.nostrProfile) {
          setNostrProfile(result.nostrProfile)
        }
      } else {
        toast({
          title: 'Update Failed',
          description: result.message,
          variant: 'destructive'
        })
      }
    })
  }

  const handlePreferencesUpdate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/account/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: 'Preferences Updated',
          description: 'Your account preferences have been saved.'
        })
        setPreferences({
          profileSource: data.profileSource || preferences.profileSource,
          primaryProvider: data.primaryProvider || preferences.primaryProvider
        })
      } else {
        toast({
          title: 'Update Failed',
          description: data.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const syncFromProvider = async (provider: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/account/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: 'Sync Complete',
          description: data.message
        })
        try {
          const aggregatedResponse = await fetch('/api/profile/aggregated')
          if (aggregatedResponse.ok) {
            const aggregated = await aggregatedResponse.json()
            setBasicProfile(prev => ({
              ...prev,
              name: (aggregated?.name?.value ?? prev.name) || prev.name,
              email: (aggregated?.email?.value ?? prev.email) || prev.email
            }))
            setEnhancedProfile(prev => ({
              ...prev,
              nip05: aggregated?.nip05?.value ?? prev.nip05,
              lud16: aggregated?.lud16?.value ?? prev.lud16,
              banner: aggregated?.banner?.value ?? prev.banner
            }))
            if (aggregated?.nip05?.value || aggregated?.lud16?.value || aggregated?.banner?.value) {
              setNostrProfile(profile => ({
                ...(profile ?? {}),
                nip05: aggregated?.nip05?.value ?? profile?.nip05,
                lud16: aggregated?.lud16?.value ?? profile?.lud16,
                banner: aggregated?.banner?.value ?? profile?.banner
              }))
            }
          }
          if (user.pubkey) {
            setNostrProfileStatus('loading')
            const nostrResponse = await fetch('/api/profile/nostr')
            if (nostrResponse.ok) {
              const nostrData = await nostrResponse.json()
              if (nostrData?.profile) {
                setNostrProfile(nostrData.profile)
                setEnhancedProfile(prev => ({
                  ...prev,
                  nip05: nostrData.profile.nip05 ?? prev.nip05,
                  lud16: nostrData.profile.lud16 ?? prev.lud16,
                  banner: nostrData.profile.banner ?? prev.banner
                }))
              }
              setNostrProfileStatus('success')
            } else {
              setNostrProfileStatus('error')
            }
          }
        } catch (err) {
          console.error('Failed to refresh aggregated profile after sync:', err)
        }
      } else {
        toast({
          title: 'Sync Failed',
          description: data.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync profile',
        variant: 'destructive'
      })
      if (user.pubkey) {
        setNostrProfileStatus('error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {initialLoadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{initialLoadError}</AlertDescription>
        </Alert>
      )}
      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Account Type
            <InfoTooltip content={fieldHelp.accountType} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={isNostrFirst ? "default" : "secondary"}>
              {isNostrFirst ? '🔵 Nostr-First' : '🟠 OAuth-First'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isNostrFirst 
                ? 'Your profile is managed via Nostr. Basic fields are read-only.'
                : 'You can edit all profile fields directly.'}
            </span>
          </div>
          
          {linkedAccounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Linked Accounts:</p>
              <div className="flex flex-wrap gap-2">
                {linkedAccounts.map((account) => (
                  <Badge key={account.provider} variant="outline">
                    {account.provider}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Profile */}
        <Card className={!canEditBasic ? 'opacity-60' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Basic Profile
              <InfoTooltip content="Core info stored in our database. OAuth-first users can edit it here." />
            </CardTitle>
            <CardDescription>
              {canEditBasic ? 'Edit your name and email' : 'Managed via Nostr profile'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Name</Label>
                  <InfoTooltip content={fieldHelp.basicName} />
                </div>
                <Input
                  id="name"
                  value={basicProfile.name}
                  onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                  placeholder="Your name"
                  disabled={!canEditBasic}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <InfoTooltip content={fieldHelp.basicEmail} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={basicProfile.email}
                  onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled={!canEditBasic}
                />
              </div>

              <Button type="submit" disabled={isPending || !canEditBasic} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Enhanced Profile
              <InfoTooltip content={fieldHelp.enhancedProfile} />
            </CardTitle>
            <CardDescription>
              Nostr and Lightning configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnhancedSubmit} className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nip05">NIP-05 Address</Label>
                  <InfoTooltip content={fieldHelp.nip05} />
                </div>
                <Input
                  id="nip05"
                  value={String(enhancedProfile.nip05 ?? '')}
                  onChange={(e) => setEnhancedProfile({ ...enhancedProfile, nip05: e.target.value })}
                  placeholder="user@domain.com"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lud16">Lightning Address</Label>
                  <InfoTooltip content={fieldHelp.lud16} />
                </div>
                <Input
                  id="lud16"
                  value={String(enhancedProfile.lud16 ?? '')}
                  onChange={(e) => setEnhancedProfile({ ...enhancedProfile, lud16: e.target.value })}
                  placeholder="user@wallet.com"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="banner">Banner URL</Label>
                  <InfoTooltip content={fieldHelp.banner} />
                </div>
                <Input
                  id="banner"
                  value={String(enhancedProfile.banner ?? '')}
                  onChange={(e) => setEnhancedProfile({ ...enhancedProfile, banner: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Profile Configuration */}
      {linkedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Configuration
              <InfoTooltip content={fieldHelp.profileSource} />
            </CardTitle>
            <CardDescription>
              Choose how your profile data is managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Profile Source</Label>
                <InfoTooltip content={fieldHelp.profileSource} />
              </div>
              <RadioGroup
                value={preferences.profileSource}
                onValueChange={(value) => setPreferences({ ...preferences, profileSource: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nostr" id="nostr-source" />
                  <Label htmlFor="nostr-source" className="font-normal cursor-pointer">
                    Nostr-First (Nostr profile is primary)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oauth" id="oauth-source" />
                  <Label htmlFor="oauth-source" className="font-normal cursor-pointer">
                    OAuth-First (Platform managed)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handlePreferencesUpdate} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync Options */}
      {linkedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sync Profile
              <InfoTooltip content={fieldHelp.syncProfile} />
            </CardTitle>
            <CardDescription>
              Pull latest data from your linked accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {linkedAccounts.map((account) => (
              <div key={account.provider} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {account.provider === 'nostr' && <Key className="h-4 w-4" />}
                  {account.provider === 'github' && <Github className="h-4 w-4" />}
                  {account.provider === 'email' && <Mail className="h-4 w-4" />}
                  <span className="font-medium capitalize">{account.provider}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncFromProvider(account.provider)}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
