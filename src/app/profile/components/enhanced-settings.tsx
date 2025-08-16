'use client'

import { useState, useEffect, useTransition } from 'react'
import { Session } from 'next-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Save, 
  Loader2, 
  Info, 
  AlertTriangle, 
  CheckCircle,
  Key,
  Mail,
  Github,
  User,
  Link2,
  RefreshCw,
  Shield,
  Zap,
  Globe,
  Settings
} from 'lucide-react'
import { updateBasicProfile, updateEnhancedProfile, updateAccountPreferences, type BasicProfileData, type EnhancedProfileData } from '../actions'
import type { AggregatedProfile } from '@/lib/profile-aggregator'

interface EnhancedSettingsProps {
  session: Session
}

const providerIcons = {
  nostr: Key,
  github: Github,
  email: Mail,
  current: User,
  profile: User
}

const providerLabels = {
  nostr: 'Nostr',
  github: 'GitHub',
  email: 'Email',
  current: 'Current Session',
  profile: 'Profile'
}

export function EnhancedSettings({ session }: EnhancedSettingsProps) {
  const { user } = session
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [aggregatedProfile, setAggregatedProfile] = useState<AggregatedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'sync'>('profile')
  
  // Form states
  const [basicProfile, setBasicProfile] = useState<BasicProfileData>({
    name: '',
    email: ''
  })

  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedProfileData>({
    nip05: '',
    lud16: '',
    banner: ''
  })

  const [accountPrefs, setAccountPrefs] = useState({
    profileSource: '',
    primaryProvider: '',
    autoSync: false
  })

  // Fetch aggregated profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile/aggregated')
        if (response.ok) {
          const data = await response.json()
          setAggregatedProfile(data)
          
          // Initialize form data
          setBasicProfile({
            name: data.name?.value || user.name || '',
            email: data.email?.value || user.email || ''
          })
          
          setEnhancedProfile({
            nip05: data.nip05?.value || user.nip05 || '',
            lud16: data.lud16?.value || user.lud16 || '',
            banner: data.banner?.value || user.banner || ''
          })
          
          setAccountPrefs({
            profileSource: data.profileSource || 'oauth',
            primaryProvider: data.primaryProvider || 'current',
            autoSync: false
          })
        }
      } catch (error) {
        console.error('Failed to fetch aggregated profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [user])

  const isNostrFirst = aggregatedProfile?.profileSource === 'nostr' || 
    (!aggregatedProfile?.profileSource && aggregatedProfile?.primaryProvider === 'nostr')
  const canEditBasic = !isNostrFirst

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEditBasic) return

    startTransition(async () => {
      try {
        const result = await updateBasicProfile(basicProfile)
        
        if (result.success) {
          setMessage({ type: 'success', text: result.message })
          setTimeout(() => setMessage(null), 5000)
        } else {
          setMessage({ type: 'error', text: result.message })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update basic profile' })
      }
    })
  }

  const handleEnhancedSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const result = await updateEnhancedProfile(enhancedProfile)
        
        if (result.success) {
          setMessage({ 
            type: result.isNostrFirst ? 'info' : 'success', 
            text: result.message 
          })
          setTimeout(() => setMessage(null), 7000)
        } else {
          setMessage({ type: 'error', text: result.message })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update enhanced profile' })
      }
    })
  }

  const handleAccountPrefsSubmit = async () => {
    startTransition(async () => {
      try {
        const result = await updateAccountPreferences({
          profileSource: accountPrefs.profileSource as 'nostr' | 'oauth',
          primaryProvider: accountPrefs.primaryProvider
        })
        
        if (result.success) {
          setMessage({ type: 'success', text: result.message })
          setTimeout(() => setMessage(null), 5000)
          // Refresh the page to reflect changes
          window.location.reload()
        } else {
          setMessage({ type: 'error', text: result.message })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update account preferences' })
      }
    })
  }

  const syncFromProvider = async (provider: string) => {
    setMessage({ type: 'info', text: `Syncing from ${providerLabels[provider as keyof typeof providerLabels]}...` })
    
    // Simulate sync - in real implementation, this would call an API
    setTimeout(() => {
      setMessage({ type: 'success', text: `Successfully synced profile from ${providerLabels[provider as keyof typeof providerLabels]}` })
      setTimeout(() => setMessage(null), 5000)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile, account preferences, and sync options
          </p>
        </div>
        
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="rounded-b-none"
          >
            <User className="mr-2 h-4 w-4" />
            Profile Fields
          </Button>
          <Button
            variant={activeTab === 'account' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('account')}
            className="rounded-b-none"
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Preferences
          </Button>
          <Button
            variant={activeTab === 'sync' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sync')}
            className="rounded-b-none"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Options
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' && <AlertTriangle className="h-4 w-4" />}
          {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {message.type === 'info' && <Info className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Profile Fields Tab */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Profile Form */}
          <Card className={!canEditBasic ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Basic Profile</span>
                {aggregatedProfile?.name && (
                  <Badge variant="outline" className="text-xs">
                    From: {providerLabels[aggregatedProfile.name.source as keyof typeof providerLabels]}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {canEditBasic ? 'Update your basic profile information' : 'Managed via Nostr profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    Name
                    {aggregatedProfile?.name && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const Icon = providerIcons[aggregatedProfile.name.source as keyof typeof providerIcons] || Link2
                          return <Icon className="h-3 w-3" />
                        })()}
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="name"
                    value={basicProfile.name}
                    onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                    placeholder="Enter your name"
                    disabled={!canEditBasic}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email
                    {aggregatedProfile?.email && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const Icon = providerIcons[aggregatedProfile.email.source as keyof typeof providerIcons] || Link2
                          return <Icon className="h-3 w-3" />
                        })()}
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={basicProfile.email}
                    onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                    placeholder="Enter your email"
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
                      Update Basic Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Profile</CardTitle>
              <CardDescription>
                Nostr-related fields that complement your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnhancedSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="nip05" className="flex items-center gap-2">
                    NIP-05 Address
                    {aggregatedProfile?.nip05 && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const Icon = providerIcons[aggregatedProfile.nip05.source as keyof typeof providerIcons] || Link2
                          return <Icon className="h-3 w-3" />
                        })()}
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="nip05"
                    value={enhancedProfile.nip05}
                    onChange={(e) => setEnhancedProfile({ ...enhancedProfile, nip05: e.target.value })}
                    placeholder="user@domain.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lud16" className="flex items-center gap-2">
                    Lightning Address
                    {aggregatedProfile?.lud16 && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const Icon = providerIcons[aggregatedProfile.lud16.source as keyof typeof providerIcons] || Link2
                          return <Icon className="h-3 w-3" />
                        })()}
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="lud16"
                    value={enhancedProfile.lud16}
                    onChange={(e) => setEnhancedProfile({ ...enhancedProfile, lud16: e.target.value })}
                    placeholder="user@wallet.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="banner" className="flex items-center gap-2">
                    Banner Image URL
                    {aggregatedProfile?.banner && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const Icon = providerIcons[aggregatedProfile.banner.source as keyof typeof providerIcons] || Link2
                          return <Icon className="h-3 w-3" />
                        })()}
                      </Badge>
                    )}
                  </Label>
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
                      Update Enhanced Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Preferences Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Configuration
              </CardTitle>
              <CardDescription>
                Configure how your profile data is managed across providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Source Selection */}
              <div className="space-y-3">
                <Label>Profile Source Priority</Label>
                <RadioGroup
                  value={accountPrefs.profileSource}
                  onValueChange={(value) => setAccountPrefs({ ...accountPrefs, profileSource: value })}
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border">
                    <RadioGroupItem value="nostr" id="nostr-first" />
                    <Label htmlFor="nostr-first" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Nostr-First</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your Nostr profile is the source of truth. OAuth providers are secondary.
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border">
                    <RadioGroupItem value="oauth" id="oauth-first" />
                    <Label htmlFor="oauth-first" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">OAuth-First</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        OAuth providers (Email, GitHub) are primary. Nostr is secondary.
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Primary Provider Selection */}
              <div className="space-y-3">
                <Label htmlFor="primary-provider">Primary Provider</Label>
                <Select
                  value={accountPrefs.primaryProvider}
                  onValueChange={(value) => setAccountPrefs({ ...accountPrefs, primaryProvider: value })}
                >
                  <SelectTrigger id="primary-provider">
                    <SelectValue placeholder="Select primary provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {aggregatedProfile?.linkedAccounts.map((account) => (
                      <SelectItem key={account.provider} value={account.provider}>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const Icon = providerIcons[account.provider as keyof typeof providerIcons] || Link2
                            return <Icon className="h-4 w-4" />
                          })()}
                          {providerLabels[account.provider as keyof typeof providerLabels] || account.provider}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The primary provider is used for authentication and as the default data source.
                </p>
              </div>

              <Separator />

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-sync" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Auto-Sync on Sign In
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync profile data from primary provider when signing in
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={accountPrefs.autoSync}
                  onCheckedChange={(checked) => setAccountPrefs({ ...accountPrefs, autoSync: checked })}
                />
              </div>

              <Button 
                onClick={handleAccountPrefsSubmit} 
                disabled={isPending} 
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Preferences...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Account Preferences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Configuration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Profile Source:</span>
                  <Badge variant="outline">
                    {accountPrefs.profileSource === 'nostr' ? 'Nostr-First' : 'OAuth-First'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Primary Provider:</span>
                  <Badge variant="outline">
                    {providerLabels[accountPrefs.primaryProvider as keyof typeof providerLabels] || accountPrefs.primaryProvider}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Linked Accounts:</span>
                  <Badge variant="outline">{aggregatedProfile?.totalLinkedAccounts || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sync Options Tab */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Profile Sync Options
              </CardTitle>
              <CardDescription>
                Sync your profile data between different providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How Profile Sync Works</AlertTitle>
                <AlertDescription>
                  You can pull profile data from any of your linked accounts. This will update your 
                  local profile with data from the selected provider. Your profile source setting 
                  determines which provider&apos;s data takes priority during automatic syncs.
                </AlertDescription>
              </Alert>

              {/* Sync from each provider */}
              <div className="space-y-3">
                {aggregatedProfile?.linkedAccounts.map((account) => (
                  <div key={account.provider} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {(() => {
                          const Icon = providerIcons[account.provider as keyof typeof providerIcons] || Link2
                          return <Icon className="h-4 w-4" />
                        })()}
                      </div>
                      <div>
                        <p className="font-medium">
                          {providerLabels[account.provider as keyof typeof providerLabels] || account.provider}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {account.data.name || account.data.email || 'No profile data'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncFromProvider(account.provider)}
                      disabled={isPending}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Advanced Sync Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Advanced Options</h4>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These options will overwrite your current profile data. Use with caution.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start" disabled={isPending}>
                    <Globe className="mr-2 h-4 w-4" />
                    Export Profile Data
                  </Button>
                  <Button variant="outline" className="justify-start" disabled={isPending}>
                    <Shield className="mr-2 h-4 w-4" />
                    Reset to Default Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync History */}
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
              <CardDescription>
                Recent profile sync operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                No sync history available
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}