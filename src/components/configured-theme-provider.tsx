"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { getDefaultDarkMode } from "@/lib/theme-ui-config"

interface ConfiguredThemeProviderProps {
  children: React.ReactNode
}

/**
 * Theme provider wrapper that uses configuration defaults
 * Applies dark mode defaults from theme.json config
 */
export function ConfiguredThemeProvider({ children }: ConfiguredThemeProviderProps) {
  const configDarkMode = getDefaultDarkMode()
  
  // Determine the default theme based on configuration
  let defaultTheme = "system"
  if (configDarkMode === true) {
    defaultTheme = "dark"
  } else if (configDarkMode === false) {
    defaultTheme = "light"
  }
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}