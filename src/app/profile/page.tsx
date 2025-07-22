/**
 * User Profile Page
 * 
 * Uses standard shadcn/ui components and patterns.
 * Features:
 * - Standard page layout using Container component
 * - Theme-aware header typography
 * - Minimal hardcoded styles, relying on shadcn defaults
 * - Responsive design using Tailwind utilities
 */

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProfileDisplay } from './components/profile-display'
import { MainLayout } from '@/components/layout'

/**
 * Server component that fetches session and renders profile
 * Redirects to signin if user is not authenticated
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information and preferences
            </p>
          </div>
          
          {/* Profile Content */}
          <ProfileDisplay session={session} />
        </div>
      </div>
    </MainLayout>
  )
}

export const metadata = {
  title: 'Profile - PlebDevs',
  description: 'Manage your profile information and preferences'
}