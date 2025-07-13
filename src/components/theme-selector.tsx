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
 * Color preview component that shows a small preview of the theme colors
 */
function ColorPreview({ colors }: { colors: Record<string, string> }) {
  const primaryColor = colors["--primary"]
  const secondaryColor = colors["--secondary"]
  const accentColor = colors["--accent"]
  
  return (
    <div className="flex gap-1">
      <div 
        className="h-3 w-3 rounded-full border border-border/20"
        style={{ backgroundColor: primaryColor }}
      />
      <div 
        className="h-3 w-3 rounded-full border border-border/20"
        style={{ backgroundColor: secondaryColor }}
      />
      <div 
        className="h-3 w-3 rounded-full border border-border/20"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  )
}

/**
 * Style preview component that shows the visual style difference
 */
function StylePreview({ style }: { style: ThemeStyle }) {
  const isNewYork = style === "new-york"
  
  return (
    <div className="flex gap-1">
      <div 
        className={`h-3 w-3 border border-border/20 bg-primary/20 ${
          isNewYork ? "rounded-none" : "rounded-full"
        }`}
      />
      <div 
        className={`h-3 w-3 border border-border/20 bg-secondary/20 ${
          isNewYork ? "rounded-none" : "rounded-sm"
        }`}
      />
      <div 
        className={`h-3 w-3 border border-border/20 bg-accent/20 ${
          isNewYork ? "rounded-none" : "rounded-md"
        }`}
      />
    </div>
  )
}

/**
 * Radius preview component that shows the border radius difference
 */
function RadiusPreview({ radius }: { radius: ThemeRadius }) {
  const radiusClasses = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full"
  }
  
  return (
    <div className="flex gap-1">
      <div 
        className={`h-3 w-3 border border-border/20 bg-muted ${radiusClasses[radius]}`}
      />
      <div 
        className={`h-3 w-4 border border-border/20 bg-muted ${radiusClasses[radius]}`}
      />
      <div 
        className={`h-3 w-3 border border-border/20 bg-muted ${radiusClasses[radius]}`}
      />
    </div>
  )
}

/**
 * Comprehensive theme selector dropdown component
 * Allows users to select colors, styles, and radius for the application
 * Shows previews for each option and persists selections in localStorage
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
      <DropdownMenuContent align="end" className="w-72">
        {/* Color Themes Section */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Color Theme
        </DropdownMenuLabel>
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleColorSelect(theme.value)}
            className="flex items-center justify-between gap-2 cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-3">
              <ColorPreview colors={theme.lightColors} />
              <div className="flex flex-col">
                <span className="font-medium">{theme.name}</span>
                <span className="text-xs text-muted-foreground">
                  {theme.description}
                </span>
              </div>
            </div>
            {themeColor === theme.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Style Section */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Style
        </DropdownMenuLabel>
        {availableStyles.map((style) => (
          <DropdownMenuItem
            key={style.value}
            onClick={() => handleStyleSelect(style.value)}
            className="flex items-center justify-between gap-2 cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-3">
              <StylePreview style={style.value} />
              <div className="flex flex-col">
                <span className="font-medium">{style.name}</span>
                <span className="text-xs text-muted-foreground">
                  {style.description}
                </span>
              </div>
            </div>
            {themeStyle === style.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Radius Section */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Border Radius
        </DropdownMenuLabel>
        {availableRadii.map((radius) => (
          <DropdownMenuItem
            key={radius.value}
            onClick={() => handleRadiusSelect(radius.value)}
            className="flex items-center justify-between gap-2 cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-3">
              <RadiusPreview radius={radius.value} />
              <div className="flex flex-col">
                <span className="font-medium">{radius.name}</span>
                <span className="text-xs text-muted-foreground">
                  {radius.description}
                </span>
              </div>
            </div>
            {themeRadius === radius.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 