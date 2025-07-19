# Theme Configuration

This document explains how to configure theme and font behavior using the `config/theme.json` file.

## Configuration File Location

The theme configuration is located at: `config/theme.json`

## Configuration Options

### UI Controls (`ui`)

Control which theme/font controls are visible in the header:

```json
{
  "ui": {
    "showThemeSelector": true,    // Show theme selector dropdown
    "showFontToggle": true,       // Show font override toggle
    "showThemeToggle": true       // Show dark/light mode toggle
  }
}
```

### Default Values (`defaults`)

Force specific theme, font, or dark mode settings:

```json
{
  "defaults": {
    "theme": null,      // Force specific theme (or null for user choice)
    "font": null,       // Force specific font (or null for theme default)
    "darkMode": null    // Force dark/light mode (or null for system/user choice)
  }
}
```

## Available Themes

You can set `defaults.theme` to any of these theme values:

### Basic Themes
- `"default"` - Clean default theme with system fonts
- `"neutral"`, `"stone"`, `"zinc"`, `"gray"`, `"slate"` - Neutral color variants
- `"red"`, `"rose"`, `"orange"`, `"green"`, `"blue"`, `"yellow"`, `"violet"` - Color themes

### Specialty Themes
- `"amber-minimal"` - Minimal amber design
- `"amethyst-haze"` - Purple amethyst colors
- `"bold-tech"` - Bold technology theme with Space Mono font
- `"bubblegum"` - Playful bubblegum colors
- `"caffeine"` - Coffee-inspired browns
- `"candyland"` - Sweet candy colors
- `"catppuccin"` - Popular pastel theme
- `"claude"` - Claude AI inspired colors
- `"claymorphism"` - Soft clay-like design
- `"clean-slate"` - Ultra-minimal design with Inter font
- `"cosmic-night"` - Deep space colors with Orbitron font
- `"cyberpunk"` - Neon cyberpunk aesthetic
- `"doom64"` - Dark gaming theme
- `"elegant-luxury"` - Sophisticated design with Playfair Display
- `"graphite"` - Industrial graphite grays
- `"midnight-bloom"` - Dark elegance with Lora font
- `"mocha-mousse"` - Warm coffee browns with Merriweather
- `"modern-minimal"` - Ultra-clean design with Poppins
- `"mono"` - Monochrome black and white
- `"nature"` - Earth-tone greens and browns
- `"neo-brutalism"` - Bold brutalist design with Space Grotesk
- `"northern-lights"` - Aurora-inspired blues with Nunito
- `"notebook"` - Paper-like notebook design
- `"ocean-breeze"` - Ocean blues with Open Sans
- `"perpetuity"` - Timeless classic design
- `"retro-arcade"` - 80s neon colors with Press Start 2P
- `"soft-pop"` - Gentle pastels with Quicksand
- `"solar-dusk"` - Sunset oranges with Raleway
- `"starry-night"` - Deep navy with Crimson Text
- `"sunset-horizon"` - Warm gradients with Source Sans Pro
- `"supabase"` - Supabase brand colors
- `"twitter"` - Twitter brand colors
- `"vercel"` - Vercel brand colors
- `"violet-bloom"` - Rich violets with Libre Baskerville

## Available Fonts

You can set `defaults.font` to any of these font values:

### Sans-Serif Fonts
- `"system"` - System default fonts
- `"inter"` - Inter (clean, modern)
- `"roboto"` - Google Roboto
- `"poppins"` - Poppins (friendly, rounded)
- `"source-sans"` - Source Sans Pro
- `"ibm-plex"` - IBM Plex Sans
- `"nunito"` - Nunito (soft, friendly)
- `"comfortaa"` - Comfortaa (rounded)
- `"orbitron"` - Orbitron (futuristic)
- `"space-grotesk"` - Space Grotesk (modern geometric)
- `"open-sans"` - Open Sans (readable)
- `"quicksand"` - Quicksand (friendly, light)
- `"raleway"` - Raleway (elegant)

### Serif Fonts
- `"playfair"` - Playfair Display (elegant)
- `"georgia"` - Georgia (classic)
- `"crimson"` - Crimson Text (readable)
- `"lora"` - Lora (friendly serif)
- `"merriweather"` - Merriweather (readable)
- `"libre-baskerville"` - Libre Baskerville (classic)

### Monospace Fonts
- `"jetbrains"` - JetBrains Mono (coding)
- `"fira"` - Fira Code (coding with ligatures)
- `"system-mono"` - System monospace
- `"space-mono"` - Space Mono (retro coding)
- `"press-start"` - Press Start 2P (retro gaming)

## Dark Mode Options

You can set `defaults.darkMode` to:

- `true` - Force dark mode
- `false` - Force light mode  
- `null` - Use system preference or user choice (default)

## Configuration Examples

### Hide All Theme Controls
```json
{
  "ui": {
    "showThemeSelector": false,
    "showFontToggle": false,
    "showThemeToggle": false
  }
}
```

### Force Dark Cosmic Theme
```json
{
  "defaults": {
    "theme": "cosmic-night",
    "darkMode": true
  }
}
```

### Force Inter Font Only
```json
{
  "ui": {
    "showFontToggle": false
  },
  "defaults": {
    "font": "inter"
  }
}
```

### Complete Corporate Setup
```json
{
  "ui": {
    "showThemeSelector": false,
    "showFontToggle": false,
    "showThemeToggle": true
  },
  "defaults": {
    "theme": "modern-minimal",
    "font": "inter"
  }
}
```

## How It Works

1. **UI Controls**: The header component reads the `ui` settings to determine which toggles to show
2. **Default Values**: The theme context uses `defaults` to set initial values on first load
3. **User Preferences**: User selections are still saved to localStorage and will override defaults on subsequent visits (unless defaults are explicitly set)
4. **Theme Packages**: Each theme includes its own default font, but `defaults.font` can override this
5. **Dark Mode**: The theme provider uses `defaults.darkMode` to set the initial dark/light mode

## Precedence Order

1. **Explicit defaults** (from config file) - highest priority
2. **User localStorage** (from previous selections)
3. **Theme defaults** (each theme's built-in font)
4. **System defaults** - lowest priority

This allows you to have full control while still respecting user preferences when appropriate.