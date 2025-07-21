# Configuration Files

This directory contains JSON configuration files that control various aspects of the PlebDevs platform behavior and appearance.

## Files Overview

### 🔐 `auth.json` - Authentication Configuration
Controls authentication providers, security settings, and UI text for the signin system.

**Key sections:**
- `providers` - Enable/disable authentication methods (email, GitHub, Nostr, anonymous, recovery)
- `security` - Session management, redirects, and access control
- `features` - UI toggles for signin page layout and components
- `copy` - All user-facing text and error messages

**Example:** Enable only GitHub and Nostr authentication:
```json
{
  "providers": {
    "email": { "enabled": false },
    "github": { "enabled": true },
    "nostr": { "enabled": true }
  }
}
```

### 🎨 `theme.json` - Theme & Font Configuration
Controls theme selector visibility and default values for the 47-theme system.

**Key sections:**
- `ui` - Show/hide theme controls in header
- `defaults` - Force specific theme, font, or dark mode

**Example:** Force dark mode with clean-slate theme:
```json
{
  "defaults": {
    "theme": "clean-slate",
    "darkMode": true
  }
}
```

### 📝 `content.json` - Content Management
Configuration for content discovery, search, and display preferences.

### 🔤 `copy.json` - Site Copy & Text
Centralized text content for marketing pages, landing sections, and general site copy.

## Configuration Priority

1. **JSON config files** (highest priority)
2. **User localStorage** (saved preferences)
3. **System defaults** (fallback)

## Usage in Code

Configurations are imported and used throughout the application:

```typescript
// Authentication config
import authConfig from '../config/auth.json'

// Theme config
import themeConfig from '../config/theme.json'

// Access provider settings
const emailEnabled = authConfig.providers.email.enabled

// Check UI toggles
const showThemeSelector = themeConfig.ui.showThemeSelector
```

## Environment-Specific Configs

For different environments, you can:
1. Override config files during build/deploy
2. Use environment variables where supported
3. Implement config file switching based on `NODE_ENV`

## Security Notes

- Configuration files are bundled into the client-side application
- Do not include secrets, API keys, or sensitive data
- Server-side secrets should use environment variables instead