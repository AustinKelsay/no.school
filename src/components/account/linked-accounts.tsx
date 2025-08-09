'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Link2, LinkIcon, Unlink, Shield, Mail, Github, Key, User } from 'lucide-react'
import { getProviderDisplayName } from '@/lib/account-linking'

interface LinkedAccount {
  provider: string
  isPrimary: boolean
  createdAt: Date
}

interface LinkedAccountsData {
  accounts: LinkedAccount[]
  primaryProvider: string | null
  profileSource: string | null
}

export function LinkedAccountsManager() {
  const { data: session, update: updateSession } = useSession()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<LinkedAccountsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null)
  const [changingPrimary, setChangingPrimary] = useState(false)
  const [providerToUnlink, setProviderToUnlink] = useState<string | null>(null)

  // Fetch linked accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/account/linked')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch linked accounts',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch linked accounts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Unlink account
  const handleUnlink = async (provider: string) => {
    setUnlinkingProvider(provider)
    try {
      const response = await fetch('/api/account/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${getProviderDisplayName(provider)} account unlinked successfully`
        })
        await fetchAccounts()
        // Update session if needed
        await updateSession()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to unlink account',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to unlink account:', error)
      toast({
        title: 'Error',
        description: 'Failed to unlink account',
        variant: 'destructive'
      })
    } finally {
      setUnlinkingProvider(null)
      setProviderToUnlink(null)
    }
  }

  // Change primary provider
  const handleChangePrimary = async (provider: string) => {
    setChangingPrimary(true)
    try {
      const response = await fetch('/api/account/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${getProviderDisplayName(provider)} is now your primary authentication method`
        })
        await fetchAccounts()
        // Update session
        await updateSession()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to change primary provider',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Failed to change primary provider:', error)
      toast({
        title: 'Error',
        description: 'Failed to change primary provider',
        variant: 'destructive'
      })
    } finally {
      setChangingPrimary(false)
    }
  }

  // Get provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'nostr':
        return <Key className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      case 'anonymous':
        return <User className="h-4 w-4" />
      case 'recovery':
        return <Shield className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  // Available providers that can be linked
  const availableProviders = ['nostr', 'email', 'github']
  const linkedProviders = accounts?.accounts.map(a => a.provider) || []
  const unlinkableProviders = availableProviders.filter(p => !linkedProviders.includes(p))

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            Manage your authentication methods and choose which profile source to use.
            {accounts?.profileSource === 'nostr' ? (
              <span className="block mt-2 text-sm font-medium">
                Profile syncs from Nostr on every login
              </span>
            ) : (
              <span className="block mt-2 text-sm font-medium">
                Profile uses OAuth provider data
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts?.accounts.map((account) => (
            <div key={account.provider} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getProviderIcon(account.provider)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getProviderDisplayName(account.provider)}</span>
                    {account.isPrimary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connected on {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!account.isPrimary && accounts.accounts.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangePrimary(account.provider)}
                    disabled={changingPrimary}
                  >
                    {changingPrimary ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Make Primary'
                    )}
                  </Button>
                )}
                {accounts.accounts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProviderToUnlink(account.provider)}
                    disabled={unlinkingProvider === account.provider}
                  >
                    {unlinkingProvider === account.provider ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Unlink className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {unlinkableProviders.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Link Additional Accounts</h4>
                <p className="text-sm text-muted-foreground">
                  Add more ways to sign in to your account
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {unlinkableProviders.map((provider) => (
                    <LinkProviderButton key={provider} provider={provider} onLinked={fetchAccounts} />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Unlink confirmation dialog */}
      <AlertDialog open={!!providerToUnlink} onOpenChange={() => setProviderToUnlink(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink {providerToUnlink && getProviderDisplayName(providerToUnlink)}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink this authentication method? You can always link it again later.
              {accounts?.accounts.length === 2 && (
                <span className="block mt-2 font-medium">
                  Note: You cannot unlink your last authentication method.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => providerToUnlink && handleUnlink(providerToUnlink)}
            >
              Unlink Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface LinkProviderButtonProps {
  provider: string
  onLinked: () => void
}

function LinkProviderButton({ provider, onLinked }: LinkProviderButtonProps) {
  const { toast } = useToast()
  const [linking, setLinking] = useState(false)

  const handleLink = async () => {
    setLinking(true)
    
    // Different linking flows for different providers
    if (provider === 'nostr') {
      // For Nostr, we need to get the user's pubkey via NIP-07
      if (!window.nostr) {
        toast({
          title: 'Nostr Extension Required',
          description: 'Please install a Nostr browser extension like Alby or nos2x',
          variant: 'destructive'
        })
        setLinking(false)
        return
      }

      try {
        const pubkey = await window.nostr.getPublicKey()
        
        const response = await fetch('/api/account/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'nostr',
            providerAccountId: pubkey
          })
        })

        const data = await response.json()

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Nostr account linked successfully'
          })
          onLinked()
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to link Nostr account',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Failed to link Nostr account:', error)
        toast({
          title: 'Error',
          description: 'Failed to get public key from Nostr extension',
          variant: 'destructive'
        })
      }
    } else if (provider === 'email' || provider === 'github') {
      // For OAuth providers, redirect to sign-in with linking mode
      toast({
        title: 'Coming Soon',
        description: `${getProviderDisplayName(provider)} account linking will be available soon`,
      })
    }
    
    setLinking(false)
  }

  const getIcon = () => {
    switch (provider) {
      case 'nostr':
        return <Key className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      default:
        return <Link2 className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLink}
      disabled={linking}
      className="gap-2"
    >
      {linking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        getIcon()
      )}
      Link {getProviderDisplayName(provider)}
    </Button>
  )
}