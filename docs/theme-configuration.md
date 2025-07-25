# Theme Configuration

This document explains the no.school theme system design philosophy and how to configure themes using the `config/theme.json` file.

## Design Philosophy: CSS Variables Over Hardcoded Styles

The no.school platform embraces a **CSS variable-driven design system** that prioritizes flexibility and consistency. Our approach is built on these core principles:

### 1. **Use Out-of-the-Box shadcn/ui Components**
We leverage shadcn/ui components as-is, without modifying their core implementations. This ensures:
- Consistency with the shadcn ecosystem
- Easy updates when shadcn releases new versions
- Predictable behavior across the application
- Reduced maintenance burden

### 2. **CSS Variables for All Styling**
Instead of hardcoding colors, spacing, or other design tokens, we use CSS variables that are dynamically set by our theme system:

```css
/* ❌ Avoid hardcoded values */
.component {
  background-color: #3b82f6;
  color: white;
}

/* ✅ Use CSS variables */
.component {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

### 3. **Complete Theme Packages**
Each theme in our system is a **complete design package** that includes:
- **Color Palette**: Primary, secondary, accent, background, foreground, and semantic colors
- **Typography**: Font family, weights, and sizes
- **Border Radius**: Consistent corner rounding across components
- **Style Variant**: Default or New York shadcn style
- **Dark Mode Support**: Separate color sets for light and dark modes

### 4. **Minimal Custom Styling**
When creating new components:
- Use shadcn/ui's utility classes (`bg-primary`, `text-foreground`, etc.)
- Leverage the `cn()` utility for conditional classes
- Avoid inline styles or component-specific CSS
- Let the theme system handle all visual styling

### Example: How Components Use the Theme System

```tsx
// ✅ Good: Using theme-aware classes
<Button variant="default" size="lg">
  Click me
</Button>

// ✅ Good: Using cn() with theme classes
<div className={cn(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  className
)}>
  Content
</div>

// ❌ Bad: Hardcoded styles
<button style={{ backgroundColor: '#3b82f6', color: 'white' }}>
  Click me
</button>
```

## How the Theme System Works

### 1. **Theme Configuration** (`src/lib/theme-config.ts`)
Contains 47+ complete theme definitions, each with:
- Light and dark color schemes
- Associated font configuration
- Border radius and style preferences
- Google Fonts integration

### 2. **Theme Context** (`src/contexts/theme-context.tsx`)
Manages theme state and applies CSS variables:
- Reads user preferences from localStorage
- Applies theme configuration from `config/theme.json`
- Updates CSS variables on the `:root` element
- Handles font overrides and dark mode toggling

### 3. **CSS Variable Application** (`src/app/globals.css`)
Defines the CSS variable structure:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... and many more */
}
```

### 4. **Component Integration**
All shadcn/ui components automatically use these CSS variables:
- Buttons use `bg-primary` and `text-primary-foreground`
- Cards use `bg-card` and `border-border`
- Inputs use `bg-background` and `border-input`
- No component knows about specific color values

## Benefits of This Approach

1. **Consistency**: All components share the same design tokens
2. **Flexibility**: Switch between 47+ themes instantly
3. **Maintainability**: Update colors in one place, affect entire app
4. **Performance**: CSS variables are highly optimized by browsers
5. **Accessibility**: Themes include proper contrast ratios
6. **User Preference**: Respects system dark mode and user choices
7. **No Build-Time Overhead**: Themes switch at runtime without rebuilds

## Best Practices for Theme-Aware Development

### 1. **Component Creation Guidelines**

When creating new components, follow these patterns:

```tsx
// ✅ GOOD: Theme-aware component
export function FeatureCard({ title, description, className }: Props) {
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

// ❌ BAD: Hardcoded styles
export function FeatureCard({ title, description }: Props) {
  return (
    <div style={{ 
      backgroundColor: '#f3f4f6', 
      padding: '24px',
      borderRadius: '8px' 
    }}>
      <h3 style={{ color: '#1f2937', fontSize: '24px' }}>{title}</h3>
      <p style={{ color: '#6b7280' }}>{description}</p>
    </div>
  )
}
```

### 2. **Using Theme Tokens**

The theme system provides these CSS variable categories:

- **Colors**: `--primary`, `--secondary`, `--accent`, `--background`, `--foreground`
- **Semantic Colors**: `--destructive`, `--warning`, `--success`, `--info`
- **Component Colors**: `--card`, `--popover`, `--input`, `--border`
- **State Colors**: `--muted`, `--ring`, `--selection`
- **Radius**: `--radius` (set by theme configuration)

### 3. **Tailwind Integration**

Our Tailwind configuration extends with theme-aware utilities:

```tsx
// Use Tailwind classes that reference CSS variables
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
  <Button className="bg-primary hover:bg-primary/90">
    Action
  </Button>
</div>
```

### 4. **Dark Mode Considerations**

Themes automatically handle dark mode, but keep these in mind:

```tsx
// ✅ GOOD: Let the theme system handle dark mode
<Card className="bg-card text-card-foreground">
  Content automatically adapts
</Card>

// ❌ BAD: Manual dark mode classes
<Card className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Manually handling dark mode
</Card>
```

### 5. **Custom Components with CVA**

When using `class-variance-authority` for variants:

```tsx
const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-success/50 text-success dark:border-success [&>svg]:text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

## Common Patterns and Examples

### Pattern 1: Status Indicators
```tsx
// Use semantic color variables
<Badge className="bg-success text-success-foreground">
  Active
</Badge>
<Badge className="bg-destructive text-destructive-foreground">
  Error
</Badge>
```

### Pattern 2: Interactive Elements
```tsx
// Hover states using opacity modifiers
<button className="bg-primary hover:bg-primary/90 transition-colors">
  Hover me
</button>
```

### Pattern 3: Borders and Dividers
```tsx
// Consistent border colors
<div className="border-b border-border">
  <Separator className="bg-border" />
</div>
```

### Pattern 4: Form Elements
```tsx
// Form styling that adapts to themes
<Input 
  className="bg-background border-input focus:ring-ring" 
  placeholder="Theme-aware input"
/>
```

## Theme System Architecture

### CSS Variable Flow
1. **Theme Selection** → User picks a theme from 47+ options
2. **Context Update** → ThemeColorProvider updates the active theme
3. **CSS Variable Injection** → Variables are applied to `:root`
4. **Component Rendering** → Components use CSS variables via Tailwind classes
5. **Runtime Updates** → Changes apply instantly without page reload

### File Structure
```
config/
  └── theme.json          # User configuration
src/
  ├── lib/
  │   ├── theme-config.ts # Theme definitions
  │   └── utils.ts        # cn() utility
  ├── contexts/
  │   └── theme-context.tsx # Theme state management
  └── app/
      └── globals.css     # CSS variable definitions
```

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
- `"amethyst"` - Purple gem colors with modern styling
- `"amethyst-haze"` - Purple amethyst colors
- `"astral"` - Cosmic purple theme with ethereal styling
- `"blaze"` - Warm orange/red theme with vibrant colors
- `"bold-tech"` - Bold technology theme with Space Mono font
- `"bubblegum"` - Playful bubblegum colors
- `"caffeine"` - Coffee-inspired browns
- `"calypso"` - Tropical teal theme with modern styling
- `"candyland"` - Sweet candy colors
- `"canvas"` - Canvas theme with modern styling
- `"catppuccin"` - Popular pastel theme
- `"citrus"` - Bright yellow/green theme with modern styling
- `"claude"` - Claude AI inspired colors
- `"claymorphism"` - Soft clay-like design
- `"clean-slate"` - Ultra-minimal design with Inter font
- `"cosmic-night"` - Deep space colors with Orbitron font
- `"cyberpunk"` - Neon cyberpunk aesthetic
- `"doom64"` - Dark gaming theme
- `"elegant-luxury"` - Sophisticated design with Playfair Display
- `"emerald"` - Rich green theme with modern styling
- `"forest"` - Deep green theme with modern styling
- `"graphite"` - Industrial graphite grays
- `"miami"` - Vibrant pink/magenta theme with modern styling
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
- `"quick-pink"` - Bright pink theme with modern styling
- `"razzmatazz"` - Bold magenta theme with modern styling
- `"retro-arcade"` - 80s neon colors with Press Start 2P
- `"santa-fe"` - Southwest orange theme with modern styling
- `"sky"` - Light blue theme with modern styling
- `"soft-pop"` - Gentle pastels with Quicksand
- `"solar"` - Bright yellow/orange theme with modern styling
- `"solar-dusk"` - Sunset oranges with Raleway
- `"spooky"` - Halloween orange/black theme with modern styling
- `"spring-bouquet"` - Fresh green/pink dual-color theme with modern styling
- `"starry-night"` - Deep navy with Crimson Text
- `"sunset-horizon"` - Warm gradients with Source Sans Pro
- `"supabase"` - Supabase brand colors
- `"twitter"` - Twitter brand colors
- `"typewriter"` - Classic black/white theme with modern styling
- `"underground"` - Dark purple theme with modern styling
- `"vercel"` - Vercel brand colors
- `"violet-bloom"` - Rich violets with Libre Baskerville
- `"xanadu"` - Earthy green theme with modern styling

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

## Summary: The no.school Theme Philosophy

The no.school theme system represents a modern approach to application theming that prioritizes:

### **Developer Experience**
- Write components once, support 47+ themes automatically
- No need to think about colors when building features
- Consistent patterns across the entire codebase
- Easy onboarding for developers familiar with shadcn/ui

### **User Experience**
- Instant theme switching without page reloads
- Respect for system preferences and accessibility needs
- Consistent visual language across all components
- Beautiful, professional themes curated from the shadcn community

### **Maintainability**
- Single source of truth for design tokens
- No scattered color values throughout the codebase
- Easy to add new themes without touching components
- Updates to shadcn/ui components work seamlessly

### **The Golden Rule**
**"Components should describe *what* they are, not *how* they look."**

By following this principle and leveraging CSS variables through our theme system, we ensure that the no.school platform remains flexible, maintainable, and beautiful across all themes.

## Quick Reference

### Do's ✅
- Use shadcn/ui components directly
- Apply theme utilities: `bg-primary`, `text-foreground`, etc.
- Leverage the `cn()` utility for conditional classes
- Let CSS variables handle all colors
- Use semantic color names for meaning
- Trust the theme system for dark mode

### Don'ts ❌
- Never hardcode hex/rgb color values
- Avoid inline styles
- Don't create component-specific color classes
- Never manually handle dark mode with `dark:` prefixes
- Don't override shadcn component internals
- Avoid pixel-specific values when possible

Remember: The theme system is your friend. Trust it, and it will ensure your components look great in every theme!