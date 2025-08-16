'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Settings, FileText, BarChart3, Link2 } from 'lucide-react'

interface ProfileTabsProps {
  children: React.ReactNode
  defaultTab?: string
  hasAdminOrModerator?: boolean
}

export function ProfileTabs({ children, defaultTab = 'profile', hasAdminOrModerator }: ProfileTabsProps) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  useEffect(() => {
    // Check for success/error messages from OAuth callback
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const tab = searchParams.get('tab')
    
    if (error) {
      let errorMessage = 'An error occurred'
      switch (error) {
        case 'redirect_uri':
          errorMessage = 'GitHub OAuth configuration error. Please contact support.'
          break
        case 'session_mismatch':
          errorMessage = 'Session expired. Please sign in again to link accounts.'
          break
        case 'already_linked':
          errorMessage = 'This account is already linked to another user.'
          break
        case 'token_exchange_failed':
          errorMessage = 'Failed to authenticate with GitHub. Please try again.'
          break
        case 'user_fetch_failed':
          errorMessage = 'Could not retrieve GitHub profile. Please try again.'
          break
        case 'linking_failed':
          errorMessage = 'Failed to link GitHub account. It may already be linked to another user.'
          break
        default:
          errorMessage = error
      }
      
      toast({
        title: 'Account Linking Failed',
        description: errorMessage,
        variant: 'destructive'
      })
      
      // Clean up URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      if (tab) newUrl.searchParams.set('tab', tab)
      window.history.replaceState({}, '', newUrl.toString())
    }
    
    if (success === 'github_linked') {
      toast({
        title: 'Success!',
        description: 'Your GitHub account has been linked successfully.'
      })
      
      // Clean up URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('success')
      if (tab) newUrl.searchParams.set('tab', tab)
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams, toast])
  
  // Determine initial tab from URL or default
  const initialTab = searchParams.get('tab') || defaultTab
  
  return (
    <Tabs defaultValue={initialTab} className="space-y-6">
      {children}
    </Tabs>
  )
}