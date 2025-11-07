"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Zap, Settings, Moon, Type, Check, LogOut, UserCircle, Plus } from "lucide-react"
import { Container } from "./container"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { FontToggle } from "@/components/font-toggle"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useCopy } from "@/lib/copy"
import { shouldShowThemeSelector, shouldShowFontToggle, shouldShowThemeToggle } from "@/lib/theme-ui-config"
import { useTheme } from "next-themes"
import { useThemeColor } from "@/contexts/theme-context"
import { availableFonts, ThemeName } from "@/lib/theme-config"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useAdminInfo } from "@/hooks/useAdmin"

/**
 * Header component for the main navigation
 * Features brand logo, search functionality, and authentication
 * Uses Container component for consistent spacing with page content
 */
export function Header() {
  const { site, navigation } = useCopy()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { fontOverride, setFontOverride, themeConfig, currentTheme, setCurrentTheme, availableThemes } = useThemeColor()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()
  const { adminInfo } = useAdminInfo()
  const canCreateContent =
    Boolean(adminInfo?.isAdmin) ||
    Boolean(adminInfo?.permissions?.createCourse) ||
    Boolean(adminInfo?.permissions?.createResource)

  function handleThemeSelect(themeName: ThemeName) {
    setCurrentTheme(themeName)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center">
        {/* Left Section */}
        <div className="flex flex-1 items-center space-x-1 sm:space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-xl font-bold">{site.brandName}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/content">{navigation.menuItems.content}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/feeds">{navigation.menuItems.feeds}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscribe">{navigation.menuItems.subscribe}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">{navigation.menuItems.about}</Link>
              </DropdownMenuItem>
              
                              {/* Theme and Style Settings - Only show on mobile */}
                {(shouldShowThemeSelector() || shouldShowFontToggle() || shouldShowThemeToggle()) && (
                  <>
                    <DropdownMenuSeparator className="sm:hidden" />
                    
                    {/* Dark/Light Mode Toggle Switch */}
                    {shouldShowThemeToggle() && (
                      <div className="flex items-center justify-between px-2 py-1.5 sm:hidden">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                        </div>
                        <Switch
                          checked={resolvedTheme === "light"}
                          onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
                          aria-label="Toggle dark mode"
                        />
                      </div>
                    )}

                    {/* Theme Selector */}
                    {shouldShowThemeSelector() && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="sm:hidden">
                          <Settings className="mr-2 h-4 w-4" />
                          Theme
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-64 max-h-80 overflow-y-auto">
                          {availableThemes.map((themeOption) => (
                            <DropdownMenuItem
                              key={themeOption.value}
                              onClick={() => handleThemeSelect(themeOption.value)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{themeOption.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {themeOption.description}
                                </span>
                                <span className="text-xs text-muted-foreground/70 mt-1">
                                  {themeOption.fontFamily.split(',')[0]} • {themeOption.borderRadius} • {themeOption.style}
                                </span>
                              </div>
                              {currentTheme === themeOption.value && (
                                <Check className="h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )}

                    {/* Font Selection */}
                    {shouldShowFontToggle() && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="sm:hidden">
                          <Type className="mr-2 h-4 w-4" />
                          Font
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => setFontOverride(null)}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Type className="mr-2 h-4 w-4" />
                              Theme Default
                            </div>
                            {fontOverride === null && <Check className="h-4 w-4" />}
                          </DropdownMenuItem>
                          {availableFonts.map((font) => (
                            <DropdownMenuItem
                              key={font.value}
                              onClick={() => setFontOverride(font.value)}
                              className="flex items-center justify-between"
                              style={{ fontFamily: font.fontFamily }}
                            >
                              <div className="flex items-center">
                                <Type className="mr-2 h-4 w-4" />
                                {font.name}
                              </div>
                              {fontOverride === font.value && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )}
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centered Search Bar */}
        <div className="flex flex-none justify-center px-4 lg:px-6">
          <form onSubmit={handleSearch} className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={navigation.searchPlaceholder}
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right-aligned Actions */}
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2 md:space-x-4">
          {/* Search icon - only show on mobile */}
          <Link href="/search" className="sm:hidden">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          
          {/* Theme controls - only show on desktop */}
          {shouldShowThemeSelector() && <div className="hidden sm:block"><ThemeSelector /></div>}
          {shouldShowFontToggle() && <div className="hidden md:block"><FontToggle /></div>}
          {shouldShowThemeToggle() && <div className="hidden sm:block"><ThemeToggle /></div>}
          
          {/* Authentication Section */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                    <AvatarFallback>
                      {(session.user.name || session.user.username || 'U').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || session.user.username || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {canCreateContent && (
                  <DropdownMenuItem asChild>
                    <Link href="/create" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm" className="text-xs sm:text-sm">{navigation.buttons.login}</Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  )
} 
