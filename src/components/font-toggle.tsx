"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useThemeColor } from "@/contexts/theme-context"
import { Check, Type } from "lucide-react"
import { useEffect, useState } from "react"
import { availableFonts } from "@/lib/theme-config"

/**
 * Font toggle dropdown component
 * Allows users to manually override the theme's default font
 * Shows current font selection and available font options
 */
export function FontToggle() {
  const [mounted, setMounted] = useState(false)
  const { 
    fontOverride,
    setFontOverride,
    themeConfig
  } = useThemeColor()

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleFontSelect(fontValue: string | null) {
    setFontOverride(fontValue)
  }

  // Get current font display name
  const currentFont = fontOverride 
    ? availableFonts.find(f => f.value === fontOverride)?.name 
    : "Theme Default"

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="Select font"
        disabled
      >
        <Type className="h-4 w-4" />
        <span className="sr-only">Select font</span>
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
          aria-label="Select font"
          title={`Font: ${currentFont}`}
        >
          <Type className="h-4 w-4" />
          <span className="sr-only">Select font</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Font Override
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleFontSelect(null)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="font-medium">Theme Default</span>
            <span className="text-xs text-muted-foreground">
              {themeConfig.fontFamily.split(',')[0]}
            </span>
          </div>
          {fontOverride === null && (
            <Check className="h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {availableFonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => handleFontSelect(font.value)}
            className="flex items-center justify-between cursor-pointer"
            style={{ fontFamily: font.fontFamily }}
          >
            <div className="flex flex-col">
              <span className="font-medium">{font.name}</span>
              <span className="text-xs text-muted-foreground">
                {font.fontFamily.split(',')[0]}
              </span>
            </div>
            {fontOverride === font.value && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}