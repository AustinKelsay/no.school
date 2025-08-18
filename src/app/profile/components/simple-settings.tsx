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
  Info, 
  AlertTriangle, 
  CheckCircle,
  Key,
  Mail,
  Github,
  RefreshCw
} from 'lucide-react'
import { updateBasicProfile, updateEnhancedProfile, type BasicProfileData, type EnhancedProfileData } from '../actions'
import { useToast } from '@/hooks/use-toast'

interface SimpleSettingsProps {
  session: Session
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

      if (errors.length > 0) setInitialLoadError(errors.join(' · '))
    }

    fetchData()
  }, [])

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

    startTransition(async () => {
      const result = await updateEnhancedProfile(enhancedProfile)
      
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your enhanced profile has been updated successfully.'
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
              nip05: (aggregated?.nip05?.value ?? prev.nip05) || prev.nip05,
              lud16: (aggregated?.lud16?.value ?? prev.lud16) || prev.lud16,
              banner: (aggregated?.banner?.value ?? prev.banner) || prev.banner
            }))
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
          <CardTitle>Account Type</CardTitle>
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
            <CardTitle>Basic Profile</CardTitle>
            <CardDescription>
              {canEditBasic ? 'Edit your name and email' : 'Managed via Nostr profile'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={basicProfile.name}
                  onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                  placeholder="Your name"
                  disabled={!canEditBasic}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
            <CardTitle>Enhanced Profile</CardTitle>
            <CardDescription>
              Nostr and Lightning configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnhancedSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nip05">NIP-05 Address</Label>
                <Input
                  id="nip05"
                  value={enhancedProfile.nip05}
                  onChange={(e) => setEnhancedProfile({ ...enhancedProfile, nip05: e.target.value })}
                  placeholder="user@domain.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lud16">Lightning Address</Label>
                <Input
                  id="lud16"
                  value={enhancedProfile.lud16}
                  onChange={(e) => setEnhancedProfile({ ...enhancedProfile, lud16: e.target.value })}
                  placeholder="user@wallet.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  value={enhancedProfile.banner}
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
            <CardTitle>Profile Configuration</CardTitle>
            <CardDescription>
              Choose how your profile data is managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Profile Source</Label>
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
            <CardTitle>Sync Profile</CardTitle>
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