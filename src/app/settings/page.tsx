import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { LinkedAccountsManager } from '@/components/account/linked-accounts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your account settings and linked authentication methods',
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and security settings
        </p>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <LinkedAccountsManager />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1">{session.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{session.user?.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nostr Public Key</label>
                  <p className="mt-1 font-mono text-xs break-all">
                    {session.user?.pubkey || 'Not set'}
                  </p>
                </div>
                {session.user?.nip05 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NIP-05 Identifier</label>
                    <p className="mt-1">{session.user.nip05}</p>
                  </div>
                )}
                {session.user?.lud16 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lightning Address</label>
                    <p className="mt-1">{session.user.lud16}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <p className="text-muted-foreground">
                Preference settings will be available soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}