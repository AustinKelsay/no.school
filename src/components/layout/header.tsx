"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Zap, Settings, Moon, Type, Check } from "lucide-react"
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

/**
 * Header component for the main navigation
 * Features brand logo, search functionality, and authentication
 * Uses Container component for consistent spacing with page content
 */
export function Header() {
  const { site, navigation } = useCopy()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { fontOverride, setFontOverride, themeConfig, currentTheme, setCurrentTheme, availableThemes } = useThemeColor()

  function handleThemeSelect(themeName: ThemeName) {
    setCurrentTheme(themeName)
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
              <DropdownMenuItem>{navigation.menuItems.content}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.feeds}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.subscribe}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.about}</DropdownMenuItem>
              
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
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={navigation.searchPlaceholder}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Right-aligned Actions */}
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2 md:space-x-4">
          {/* Search icon - only show on mobile */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Theme controls - only show on desktop */}
          {shouldShowThemeSelector() && <div className="hidden sm:block"><ThemeSelector /></div>}
          {shouldShowFontToggle() && <div className="hidden md:block"><FontToggle /></div>}
          {shouldShowThemeToggle() && <div className="hidden sm:block"><ThemeToggle /></div>}
          
          <Button size="sm" className="text-xs sm:text-sm">{navigation.buttons.login}</Button>
        </div>
      </Container>
    </header>
  )
} 