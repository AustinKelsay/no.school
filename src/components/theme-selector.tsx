"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useThemeColor } from "@/contexts/theme-context"
import { Check, Palette } from "lucide-react"
import { ThemeColor, ThemeStyle, ThemeRadius } from "@/lib/theme-config"
import { useEffect, useState } from "react"

/**
 * Comprehensive theme selector dropdown component
 * Allows users to select colors, styles, and radius for the application
 * Shows simple text labels and persists selections in localStorage
 */
export function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const { 
    themeColor, 
    setThemeColor, 
    availableThemes,
    themeStyle,
    setThemeStyle,
    availableStyles,
    themeRadius,
    setThemeRadius,
    availableRadii
  } = useThemeColor()

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleColorSelect(color: ThemeColor) {
    setThemeColor(color)
  }

  function handleStyleSelect(style: ThemeStyle) {
    setThemeStyle(style)
  }

  function handleRadiusSelect(radius: ThemeRadius) {
    setThemeRadius(radius)
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
      <DropdownMenuContent align="end" className="w-56">
        {/* Color Themes Section */}
        <DropdownMenuLabel>
          Color Theme
        </DropdownMenuLabel>
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleColorSelect(theme.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
            </div>
            {themeColor === theme.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Style Section */}
        <DropdownMenuLabel>
          Style
        </DropdownMenuLabel>
        {availableStyles.map((style) => (
          <DropdownMenuItem
            key={style.value}
            onClick={() => handleStyleSelect(style.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{style.name}</span>
              <span className="text-xs text-muted-foreground">
                {style.description}
              </span>
            </div>
            {themeStyle === style.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Radius Section */}
        <DropdownMenuLabel>
          Border Radius
        </DropdownMenuLabel>
        {availableRadii.map((radius) => (
          <DropdownMenuItem
            key={radius.value}
            onClick={() => handleRadiusSelect(radius.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{radius.name}</span>
              <span className="text-xs text-muted-foreground">
                {radius.description}
              </span>
            </div>
            {themeRadius === radius.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 