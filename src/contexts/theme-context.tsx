"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useTheme } from "next-themes"
import { 
  ThemeName, 
  CompleteTheme,
  completeThemes, 
  applyCompleteTheme, 
  getCompleteTheme,
  getDefaultTheme,
  defaultThemeName,
  availableFonts,
  FontConfig
} from "@/lib/theme-config"

interface SimpleThemeContextType {
  currentTheme: ThemeName
  setCurrentTheme: (theme: ThemeName) => void
  themeConfig: CompleteTheme
  availableThemes: CompleteTheme[]
  fontOverride: string | null
  setFontOverride: (font: string | null) => void
}

const ThemeContext = createContext<SimpleThemeContextType | undefined>(undefined)

/**
 * Simplified theme provider that manages complete theme packages
 * Each theme includes colors, fonts, border radius, and style
 * No manual controls - themes are complete packages
 */
export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentThemeState] = useState<ThemeName>(defaultThemeName)
  const [fontOverride, setFontOverrideState] = useState<string | null>(null)

  // Initialize from localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    const savedTheme = localStorage.getItem("complete-theme") as ThemeName
    const savedFont = localStorage.getItem("font-override")
    
    if (savedTheme && completeThemes.find(theme => theme.value === savedTheme)) {
      setCurrentThemeState(savedTheme)
    }
    
    if (savedFont) {
      setFontOverrideState(savedFont)
    }
    
    setMounted(true)
  }, [])

  // Apply theme when mounted and when theme changes
  useEffect(() => {
    if (!mounted) return
    
    const themeConfig = getCompleteTheme(currentTheme) || getDefaultTheme()
    
    // Use resolvedTheme to get the actual theme (light/dark) after system resolution
    const isDark = resolvedTheme === "dark"
    applyCompleteTheme(themeConfig, isDark, fontOverride)
  }, [currentTheme, resolvedTheme, mounted, fontOverride])

  // Setter with localStorage persistence
  const setCurrentTheme = (theme: ThemeName) => {
    setCurrentThemeState(theme)
    localStorage.setItem("complete-theme", theme)
  }
  
  // Font override setter
  const setFontOverride = (font: string | null) => {
    setFontOverrideState(font)
    if (font) {
      localStorage.setItem("font-override", font)
    } else {
      localStorage.removeItem("font-override")
    }
  }

  // Get current theme config
  const themeConfig = getCompleteTheme(currentTheme) || getDefaultTheme()

  const value: SimpleThemeContextType = {
    currentTheme,
    setCurrentTheme,
    themeConfig,
    availableThemes: [...completeThemes].sort((a, b) => a.name.localeCompare(b.name)),
    fontOverride,
    setFontOverride,
  }

  // Prevent hydration mismatch by not rendering context until mounted
  if (!mounted) {
    // Provide default values during SSR/before mount
    const defaultValue: SimpleThemeContextType = {
      currentTheme: defaultThemeName,
      setCurrentTheme: () => {},
      themeConfig: getDefaultTheme(),
      availableThemes: [...completeThemes].sort((a, b) => a.name.localeCompare(b.name)),
      fontOverride: null,
      setFontOverride: () => {},
    }
    
    return (
      <ThemeContext.Provider value={defaultValue}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access simplified theme context
 */
export function useThemeColor() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider")
  }
  return context
}