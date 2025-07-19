"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useThemeColor } from "@/contexts/theme-context"
import { Check, Palette } from "lucide-react"
import { ThemeName } from "@/lib/theme-config"
import { useEffect, useState } from "react"

/**
 * Simplified theme selector dropdown component
 * Users select complete theme packages that include colors, fonts, radius, and style
 * No manual controls - each theme is a complete package
 */
export function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const { 
    currentTheme, 
    setCurrentTheme, 
    availableThemes
  } = useThemeColor()

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleThemeSelect(theme: ThemeName) {
    setCurrentTheme(theme)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="Select theme"
        disabled
      >
        <Palette className="h-4 w-4" />
        <span className="sr-only">Select theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Select theme"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          Theme Packages
        </DropdownMenuLabel>
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeSelect(theme.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
              <span className="text-xs text-muted-foreground/70 mt-1">
                {theme.fontFamily.split(',')[0]} • {theme.borderRadius} • {theme.style}
              </span>
            </div>
            {currentTheme === theme.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}