/**
 * @fileoverview Base page layout wrapper component
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { useState } from 'react';
import { Header } from './Header';
import type { PageLayoutProps } from '@/types';

/**
 * Base page layout with header, main content area, and optional sidebar
 *
 * @component
 * @param {PageLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered layout component
 */
export function PageLayout({
  children,
  showHeader = true,
  showFooter = false,
  showSidebar = false,
  requireAuth = false,
  className = '',
  ...props
}: Omit<PageLayoutProps, 'title' | 'description'>) {
  // Mock user state - in real app this would come from auth context
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Mock login - in real app this would open login modal
    console.log('Login clicked');
  };

  const handleLogout = () => {
    // Mock logout - in real app this would clear auth state
    console.log('Logout clicked');
    setUser(null);
  };

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 ${className}`}
      {...props}
    >
      {/* Page title is handled by Next.js metadata API in layout.tsx */}

      {/* Header */}
      {showHeader && (
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      )}

      {/* Main content area */}
      <main className="flex-1">
        {/* Auth guard */}
        {requireAuth && !user ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="mx-auto max-w-md">
              <h1 className="mb-4 text-2xl font-bold">
                Authentication Required
              </h1>
              <p className="mb-6 text-zinc-400">
                You need to be logged in to access this page.
              </p>
              <button onClick={handleLogin} className="btn-bitcoin">
                Login to Continue
              </button>
            </div>
          </div>
        ) : (
          <div className={showSidebar ? 'flex' : ''}>
            {/* Sidebar */}
            {showSidebar && (
              <aside className="min-h-screen w-64 border-r border-zinc-800 bg-zinc-900">
                <div className="p-4">
                  <h3 className="mb-4 font-semibold text-zinc-200">
                    Navigation
                  </h3>
                  {/* Sidebar content would go here */}
                </div>
              </aside>
            )}

            {/* Page content */}
            <div className="flex-1">{children}</div>
          </div>
        )}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="border-t border-zinc-800 bg-zinc-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 flex items-center space-x-2 md:mb-0">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-bitcoin-orange">
                  <span className="text-sm font-bold text-zinc-950">⚡</span>
                </div>
                <span className="font-semibold text-zinc-100">PlebDevs</span>
              </div>

              <div className="flex space-x-6 text-sm text-zinc-400">
                <a
                  href="/about"
                  className="transition-colors hover:text-zinc-200"
                >
                  About
                </a>
                <a
                  href="/privacy"
                  className="transition-colors hover:text-zinc-200"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="transition-colors hover:text-zinc-200"
                >
                  Terms
                </a>
                <a
                  href="/support"
                  className="transition-colors hover:text-zinc-200"
                >
                  Support
                </a>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
              <p>© 2024 PlebDevs. Built with ⚡ on Bitcoin and Nostr.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
