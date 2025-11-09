'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Tabs } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface ProfileTabsProps {
  children: ReactNode
  defaultTab?: string
  allowedTabs?: string[]
}

export function ProfileTabs({
  children,
  defaultTab = 'profile',
  allowedTabs = []
}: ProfileTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [tabValue, setTabValue] = useState(defaultTab)
  const handledGithubLinkRef = useRef(false)

  const permittedTabs = useMemo(() => {
    if (!allowedTabs.length) {
      return undefined
    }
    return Array.from(new Set([...allowedTabs, defaultTab]))
  }, [allowedTabs, defaultTab])

  const updateQueryParam = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('error')
    params.delete('success')
    params.set('tab', value)
    const queryString = params.toString()
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    // Check for success/error messages from OAuth callback
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const tab = searchParams.get('tab')
    const params = new URLSearchParams(searchParams.toString())
    
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
      params.delete('error')
    }
    
    if (success === 'github_linked') {
      if (!handledGithubLinkRef.current) {
        handledGithubLinkRef.current = true
        toast({
          title: 'Success!',
          description: 'Your GitHub account has been linked successfully.'
        })
      }
      // Clean up URL
      params.delete('success')
    } else {
      handledGithubLinkRef.current = false
    }
    
    if (tab) {
      const isPermitted = !permittedTabs || permittedTabs.includes(tab)
      const resolvedTab = isPermitted ? tab : defaultTab
      params.set('tab', resolvedTab)
    }

    if (error || success === 'github_linked') {
      const nextQuery = params.toString()
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      router.replace(nextUrl, { scroll: false })
    }
  }, [defaultTab, pathname, permittedTabs, router, searchParams, toast])

  // Determine initial tab from URL or default
  useEffect(() => {
    const searchTab = searchParams.get('tab') || defaultTab
    const isPermitted = !permittedTabs || permittedTabs.includes(searchTab)
    const nextTab = isPermitted ? searchTab : defaultTab
    if (!isPermitted && searchTab) {
      updateQueryParam(defaultTab)
    }
    setTabValue((current) => (current === nextTab ? current : nextTab))
  }, [defaultTab, permittedTabs, searchParams, updateQueryParam])

  const handleValueChange = (value: string) => {
    if (permittedTabs && !permittedTabs.includes(value)) return
    setTabValue(value)
    updateQueryParam(value)
  }

  return (
    <Tabs value={tabValue} onValueChange={handleValueChange} className="space-y-6">
      {children}
    </Tabs>
  )
}
