"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useTheme } from "next-themes"
import { 
  ThemeColor, 
  ThemeStyle, 
  ThemeRadius, 
  ThemeConfig, 
  StyleConfig, 
  RadiusConfig,
  FullThemeConfig,
  themeConfigs, 
  styleConfigs, 
  radiusConfigs,
  applyFullTheme, 
  getThemeConfig,
  getStyleConfig,
  getRadiusConfig,
  defaultTheme
} from "@/lib/theme-config"

interface ThemeContextType {
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
  themeConfig: ThemeConfig
  availableThemes: ThemeConfig[]
  
  themeStyle: ThemeStyle
  setThemeStyle: (style: ThemeStyle) => void
  styleConfig: StyleConfig
  availableStyles: StyleConfig[]
  
  themeRadius: ThemeRadius
  setThemeRadius: (radius: ThemeRadius) => void
  radiusConfig: RadiusConfig
  availableRadii: RadiusConfig[]
  
  fullTheme: FullThemeConfig
  setFullTheme: (theme: FullThemeConfig) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Enhanced theme provider that manages color, style, and radius themes
 * Follows shadcn/next-themes best practices for hydration and persistence
 */
export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Theme state
  const [themeColor, setThemeColorState] = useState<ThemeColor>(defaultTheme.color)
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(defaultTheme.style)
  const [themeRadius, setThemeRadiusState] = useState<ThemeRadius>(defaultTheme.radius)

  // Initialize from localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor
    const savedStyle = localStorage.getItem("theme-style") as ThemeStyle
    const savedRadius = localStorage.getItem("theme-radius") as ThemeRadius
    
    if (savedColor && themeConfigs.find(config => config.value === savedColor)) {
      setThemeColorState(savedColor)
    }
    if (savedStyle && styleConfigs.find(config => config.value === savedStyle)) {
      setThemeStyleState(savedStyle)
    }
    if (savedRadius && radiusConfigs.find(config => config.value === savedRadius)) {
      setThemeRadiusState(savedRadius)
    }
    
    setMounted(true)
  }, [])

  // Apply themes when mounted and when theme changes
  useEffect(() => {
    if (!mounted) return
    
    const fullThemeConfig: FullThemeConfig = {
      color: themeColor,
      style: themeStyle,
      radius: themeRadius,
    }
    
    // Use resolvedTheme to get the actual theme (light/dark) after system resolution
    const isDark = resolvedTheme === "dark"
    applyFullTheme(fullThemeConfig, isDark)
  }, [themeColor, themeStyle, themeRadius, resolvedTheme, mounted])

  // Setters with localStorage persistence
  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color)
    localStorage.setItem("theme-color", color)
  }

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeStyleState(style)
    localStorage.setItem("theme-style", style)
  }

  const setThemeRadius = (radius: ThemeRadius) => {
    setThemeRadiusState(radius)
    localStorage.setItem("theme-radius", radius)
  }

  const setFullTheme = (fullTheme: FullThemeConfig) => {
    setThemeColor(fullTheme.color)
    setThemeStyle(fullTheme.style)
    setThemeRadius(fullTheme.radius)
  }

  // Get current configs
  const themeConfig = getThemeConfig(themeColor) || getThemeConfig(defaultTheme.color)!
  const styleConfig = getStyleConfig(themeStyle) || getStyleConfig(defaultTheme.style)!
  const radiusConfig = getRadiusConfig(themeRadius) || getRadiusConfig(defaultTheme.radius)!

  const fullTheme: FullThemeConfig = {
    color: themeColor,
    style: themeStyle,
    radius: themeRadius,
  }

  const value: ThemeContextType = {
    themeColor,
    setThemeColor,
    themeConfig,
    availableThemes: themeConfigs,
    themeStyle,
    setThemeStyle,
    styleConfig,
    availableStyles: styleConfigs,
    themeRadius,
    setThemeRadius,
    radiusConfig,
    availableRadii: radiusConfigs,
    fullTheme,
    setFullTheme,
  }

  // Prevent hydration mismatch by not rendering context until mounted
  if (!mounted) {
    // Provide default values during SSR/before mount
    const defaultValue: ThemeContextType = {
      themeColor: defaultTheme.color,
      setThemeColor: () => {},
      themeConfig: getThemeConfig(defaultTheme.color)!,
      availableThemes: themeConfigs,
      themeStyle: defaultTheme.style,
      setThemeStyle: () => {},
      styleConfig: getStyleConfig(defaultTheme.style)!,
      availableStyles: styleConfigs,
      themeRadius: defaultTheme.radius,
      setThemeRadius: () => {},
      radiusConfig: getRadiusConfig(defaultTheme.radius)!,
      availableRadii: radiusConfigs,
      fullTheme: defaultTheme,
      setFullTheme: () => {},
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
 * Hook to access comprehensive theme context
 */
export function useThemeColor() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider")
  }
  return context
} 