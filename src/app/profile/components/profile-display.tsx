'use client'

/**
 * Profile Display Component
 * 
 * Uses standard shadcn/ui components with minimal hardcoded styles.
 * Relies on configurable theme system for all styling.
 * 
 * Features:
 * - Theme-aware design using shadcn component variants
 * - Responsive layout using CSS Grid and Flexbox utilities
 * - Standard shadcn component patterns and spacing
 */

import { useState } from 'react'
import { Session } from 'next-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Key, 
  Globe, 
  MapPin, 
  Github, 
  Twitter,
  ExternalLink,
  Edit,
  Copy,
  Check,
  Zap,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ProfileEditForms } from './profile-edit-forms'

interface ProfileDisplayProps {
  session: Session
}

export function ProfileDisplay({ session }: ProfileDisplayProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const { user } = session

  // Determine authentication method and capabilities
  const isNostrFirst = !user.privkey
  const canSignEvents = !!user.privkey
  const hasCompleteProfile = !!user.nostrProfile

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

  if (showEditForm) {
    return <ProfileEditForms session={session} onClose={() => setShowEditForm(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                <AvatarFallback>
                  {(user.name || user.username || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl">
                  {user.name || user.username || 'Unknown User'}
                </CardTitle>
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
      {user.banner && (
        <Card>
          <CardContent className="p-0">
            <OptimizedImage
              src={user.banner}
              alt="Profile Banner"
              width={800}
              height={200}
              className="aspect-[4/1] w-full rounded-lg object-cover"
            />
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
            {user.name && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Name:</span>
                  <span className="text-muted-foreground">{user.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.name!, 'name')}
                >
                  {copiedField === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            {user.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.email!, 'email')}
                >
                  {copiedField === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {user.username && user.username !== user.name && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Username:</span>
                  <span className="text-muted-foreground">{user.username}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.username!, 'username')}
                >
                  {copiedField === 'username' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
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
            {user.pubkey && (
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="block font-medium">Public Key</span>
                  <code className="block text-sm text-muted-foreground font-mono break-all">
                    {formatKey(user.pubkey)}
                  </code>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.pubkey!, 'pubkey')}
                >
                  {copiedField === 'pubkey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {user.nip05 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-muted-foreground">{user.nip05}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.nip05!, 'nip05')}
                >
                  {copiedField === 'nip05' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {user.lud16 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">{user.lud16}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(user.lud16!, 'lud16')}
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

      {/* Complete Nostr Profile */}
      {hasCompleteProfile && user.nostrProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Complete Nostr Profile
            </CardTitle>
            <CardDescription>
              All profile information from your Nostr identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* About/Bio */}
              {!!user.nostrProfile.about && (
                <div className="sm:col-span-2">
                  <h4 className="mb-2 font-medium">About</h4>
                  <p className="text-muted-foreground">
                    {String(user.nostrProfile.about)}
                  </p>
                </div>
              )}

              {/* Website */}
              {!!user.nostrProfile.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={String(user.nostrProfile.website)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {String(user.nostrProfile.website)}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Location */}
              {!!user.nostrProfile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-muted-foreground">{String(user.nostrProfile.location)}</span>
                </div>
              )}

              {/* GitHub */}
              {!!user.nostrProfile.github && (
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <a 
                    href={`https://github.com/${user.nostrProfile.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    @{String(user.nostrProfile.github)}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Twitter */}
              {!!user.nostrProfile.twitter && (
                <div className="flex items-center space-x-2">
                  <Twitter className="h-4 w-4" />
                  <a 
                    href={`https://twitter.com/${user.nostrProfile.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    @{String(user.nostrProfile.twitter)}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Additional Fields */}
            <Separator className="my-6" />
            <div className="space-y-2">
              <h4 className="font-medium">Additional Profile Fields</h4>
              <div className="grid gap-2">
                {Object.entries(user.nostrProfile)
                  .filter(([key]) => !['name', 'picture', 'about', 'website', 'location', 'github', 'twitter', 'nip05', 'lud16', 'banner'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-muted-foreground truncate max-w-xs">
                        {String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Details about your account type and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span className="font-medium">Account Type:</span>
              <span className="text-muted-foreground">
                {isNostrFirst ? 'Nostr-First Account' : 'OAuth-First Account'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Key Custody:</span>
              <span className="text-muted-foreground">
                {isNostrFirst ? 'User Controlled (NIP07)' : 'Platform Managed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Can Sign Events:</span>
              <span className="text-muted-foreground">
                {canSignEvents ? 'Yes' : 'No (External signing required)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Complete Profile:</span>
              <span className="text-muted-foreground">
                {hasCompleteProfile ? 'Available from Nostr' : 'Basic fields only'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}