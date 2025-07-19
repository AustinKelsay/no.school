/**
 * Theme UI Configuration
 * Manages theme and font toggle visibility and default values
 */

import { ThemeName, completeThemes, availableFonts } from './theme-config'
import themeConfig from '../../config/theme.json'

export interface ThemeUIConfig {
  ui: {
    showThemeSelector: boolean
    showFontToggle: boolean
    showThemeToggle: boolean
  }
  defaults: {
    theme: ThemeName | null
    font: string | null
    darkMode: boolean | null
  }
}

/**
 * Get the theme UI configuration
 */
export function getThemeUIConfig(): ThemeUIConfig {
  return themeConfig as ThemeUIConfig
}

/**
 * Check if theme selector should be shown
 */
export function shouldShowThemeSelector(): boolean {
  return getThemeUIConfig().ui.showThemeSelector
}

/**
 * Check if font toggle should be shown
 */
export function shouldShowFontToggle(): boolean {
  return getThemeUIConfig().ui.showFontToggle
}

/**
 * Check if theme toggle should be shown
 */
export function shouldShowThemeToggle(): boolean {
  return getThemeUIConfig().ui.showThemeToggle
}

/**
 * Get default theme if configured
 */
export function getDefaultTheme(): ThemeName | null {
  return getThemeUIConfig().defaults.theme
}

/**
 * Get default font if configured
 */
export function getDefaultFont(): string | null {
  return getThemeUIConfig().defaults.font
}

/**
 * Get default dark mode setting if configured
 */
export function getDefaultDarkMode(): boolean | null {
  return getThemeUIConfig().defaults.darkMode
}

/**
 * Validate that the configured theme exists
 */
export function validateConfiguredTheme(): boolean {
  const configTheme = getDefaultTheme()
  if (!configTheme) return true // null is valid
  
  return completeThemes.some(theme => theme.value === configTheme)
}

/**
 * Validate that the configured font exists
 */
export function validateConfiguredFont(): boolean {
  const configFont = getDefaultFont()
  if (!configFont) return true // null is valid
  
  return availableFonts.some(font => font.value === configFont)
}

/**
 * Get validation errors for the current configuration
 */
export function getConfigValidationErrors(): string[] {
  const errors: string[] = []
  
  if (!validateConfiguredTheme()) {
    errors.push(`Invalid theme "${getDefaultTheme()}" in config. Available themes: ${completeThemes.map(t => t.value).join(', ')}`)
  }
  
  if (!validateConfiguredFont()) {
    errors.push(`Invalid font "${getDefaultFont()}" in config. Available fonts: ${availableFonts.map(f => f.value).join(', ')}`)
  }
  
  return errors
}