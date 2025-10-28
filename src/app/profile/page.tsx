/**
 * User Profile Page with Tabs
 * 
 * Uses standard shadcn/ui components and patterns.
 * Features:
 * - Tabbed interface with Profile, Settings, and admin-only tabs
 * - Standard page layout using Container component
 * - Theme-aware header typography
 * - Minimal hardcoded styles, relying on shadcn defaults
 * - Responsive design using Tailwind utilities
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { EnhancedProfileDisplay } from './components/enhanced-profile-display'
import { SimpleSettings } from './components/simple-settings'
import { AdminContentManager } from './components/admin-content-manager'
import { MainLayout } from '@/components/layout'
import { Container } from '@/components/layout/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Settings, FileText, BarChart3, Link2 } from 'lucide-react'
import { getAdminInfo } from '@/lib/admin-utils'
import { LinkedAccountsManager } from '@/components/account/linked-accounts'
import { ProfileTabs } from './components/profile-tabs'

/**
 * Server component that fetches session and renders tabbed profile
 * Redirects to signin if user is not authenticated
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Get comprehensive admin information using the new admin utilities
  const adminInfo = await getAdminInfo(session)
  const isAdmin = adminInfo.isAdmin
  const isModerator = adminInfo.isModerator
  const hasAdminOrModerator = isAdmin || isModerator
  const allowedTabs = ['profile', 'settings', 'accounts']

  if (hasAdminOrModerator) {
    allowedTabs.push('content')
    if (adminInfo.permissions.viewAnalytics) {
      allowedTabs.push('analytics')
    }
  }

  const triggerResponsiveClasses = 'h-11 sm:h-12 min-w-[8rem] flex-1 sm:flex-none'

  return (
    <MainLayout>
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Profile</h1>
              <p className="text-muted-foreground text-base">
                Manage your profile information and preferences
              </p>
            </div>
          </div>

          {/* Tabbed Profile Content */}
          <ProfileTabs defaultTab="profile" allowedTabs={allowedTabs}>
            <div className="overflow-x-auto pb-2 sm:overflow-visible sm:pb-0">
              <TabsList className="inline-flex min-w-full flex-nowrap gap-2 rounded-xl border border-border bg-card/60 p-1.5 shadow-sm backdrop-blur-sm !h-auto sm:min-w-0 sm:flex-wrap sm:justify-start">
                <TabsTrigger value="profile" className={`${triggerResponsiveClasses} flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:text-base sm:justify-start`}>
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="settings" className={`${triggerResponsiveClasses} flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:text-base sm:justify-start`}>
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="accounts" className={`${triggerResponsiveClasses} flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:text-base sm:justify-start`}>
                  <Link2 className="h-4 w-4" />
                  Accounts
                </TabsTrigger>
                {hasAdminOrModerator && (
                  <>
                    <TabsTrigger value="content" className={`${triggerResponsiveClasses} flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:text-base sm:justify-start`}>
                      <FileText className="h-4 w-4" />
                      Content
                    </TabsTrigger>
                    {adminInfo.permissions.viewAnalytics && (
                      <TabsTrigger value="analytics" className={`${triggerResponsiveClasses} flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:text-base sm:justify-start`}>
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </TabsTrigger>
                    )}
                  </>
                )}
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6">
              <EnhancedProfileDisplay session={session} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SimpleSettings session={session} />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              <LinkedAccountsManager />
            </TabsContent>

            {hasAdminOrModerator && (
              <>
                <TabsContent value="content" className="space-y-6">
                  <AdminContentManager userId={session.user.id} />
                </TabsContent>

                {adminInfo.permissions.viewAnalytics && (
                  <TabsContent value="analytics" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Analytics Dashboard
                          {adminInfo.source === 'config' && (
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              (Config-based)
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Analytics and insights about platform usage, course engagement, and user metrics will be displayed here.
                        </p>
                        
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Analytics Features:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Platform usage metrics</li>
                              <li>• Course engagement statistics</li>
                              <li>• User registration trends</li>
                              <li>• Content performance insights</li>
                              <li>• Revenue and payment analytics</li>
                            </ul>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Admin level: <strong>{adminInfo.level}</strong> | 
                            Source: <strong>{adminInfo.source}</strong>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </>
            )}
          </ProfileTabs>
        </div>
      </Container>
    </MainLayout>
  )
}

export const metadata = {
  title: 'Profile - PlebDevs',
  description: 'Manage your profile information and preferences'
}
