/**
 * @fileoverview Main navigation header component
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HeaderProps } from '@/types';

/**
 * Main navigation header with authentication and search
 *
 * @component
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} Rendered header component
 */
export function Header({
  user,
  onLogin,
  onLogout,
  showSearchBar = true,
  className = '',
  ...props
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 ${className}`}
      {...props}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bitcoin-orange">
              <span className="text-lg font-bold text-zinc-950">⚡</span>
            </div>
            <span className="text-xl font-bold text-zinc-100">PlebDevs</span>
          </Link>

          <Badge variant="secondary" className="hidden sm:inline-flex">
            Beta
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/content" className="nav-link">
            Content
          </Link>
          <Link href="/feeds" className="nav-link">
            Feeds
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          {user?.role?.admin && (
            <Link href="/create" className="nav-link">
              Create
            </Link>
          )}
        </nav>

        {/* Search bar */}
        {showSearchBar && (
          <div className="mx-6 hidden max-w-md flex-1 lg:flex">
            <div className="w-full">
              <input
                type="search"
                placeholder="Search courses, videos, docs..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 transition-all duration-200 placeholder:text-zinc-500 focus:border-lightning-purple focus:ring-2 focus:ring-lightning-purple/20"
              />
            </div>
          </div>
        )}

        {/* User actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link href="/profile" className="nav-link">
                Profile
              </Link>
              {user.avatar ? (
                <Link href="/profile">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-700 transition-colors hover:border-zinc-600">
                    <Image
                      src={user.avatar}
                      alt={user.username || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ) : (
                <Link href="/profile">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 transition-colors hover:bg-zinc-600">
                    <span className="text-sm font-medium text-zinc-300">
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onLogin}
              className="btn-bitcoin"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
