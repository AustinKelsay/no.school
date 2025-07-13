# Design Rules - PlebDevs ⚡️

## Design Philosophy

### Core Principles

**1. Minimalist Cypherpunk Aesthetic**

- Clean, technical interfaces that respect user privacy and intelligence
- Information density optimized for developers without visual clutter
- Subtle Bitcoin/crypto cultural references integrated naturally
- Dark-first design with high contrast for readability

**2. Trustless Interface Design**

- Clear, verifiable information presentation
- No hidden complexity or misleading visual patterns
- Transparent interaction states and system feedback
- Honest representation of data and user progress

**3. Sovereign User Experience**

- Self-explanatory interfaces that don't require external documentation
- Keyboard-first navigation with mouse as secondary input method
- Configurable elements that respect user preferences
- No dark patterns or manipulative design elements

**4. Decentralized Scalability**

- Component system that works across different contexts and platforms
- White-label ready with complete visual customization
- Responsive design that degrades gracefully
- Performance-first approach with minimal resource usage

---

## Color Palette

### Primary Colors

```scss
// Core Brand Colors
--bitcoin-orange: #f2a900; // Primary actions, payments, CTAs
--lightning-purple: #7b68ee; // Instant features, real-time updates
--nostr-purple: #8b5cf6; // Social features, decentralized content

// Neutral Base (Dark-first)
--zinc-950: #09090b; // Primary background
--zinc-900: #18181b; // Secondary background
--zinc-800: #27272a; // Tertiary background
--zinc-700: #3f3f46; // Border primary
--zinc-600: #52525b; // Border secondary
--zinc-500: #71717a; // Text muted
--zinc-400: #a1a1aa; // Text secondary
--zinc-300: #d4d4d8; // Text primary
--zinc-100: #f4f4f5; // High contrast text
--zinc-50: #fafafa; // Maximum contrast
```

### Semantic Colors

```scss
// Status & Feedback
--success: #10b981; // Completed states, confirmations
--warning: #f59e0b; // Caution, pending states
--error: #ef4444; // Errors, destructive actions
--info: #3b82f6; // Information, links

// Semantic Backgrounds
--success-bg: #064e3b; // Success container
--warning-bg: #78350f; // Warning container
--error-bg: #7f1d1d; // Error container
--info-bg: #1e3a8a; // Info container
```

### Interactive States

```scss
// Hover & Focus States
--hover-overlay: rgba(244, 244, 245, 0.05);
--focus-ring: #7b68ee;
--selection-bg: rgba(123, 104, 238, 0.2);
--selection-text: #f4f4f5;
```

---

## Typography

### Font Stacks

```scss
// Primary: Clean, technical sans-serif
--font-primary:
  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Monospace: Code, technical data, addresses
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

// Display: Headings, hero text (sparingly)
--font-display:
  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

```scss
// Display & Headings
--text-6xl: 3.75rem; // 60px - Hero text
--text-5xl: 3rem; // 48px - Main page headings
--text-4xl: 2.25rem; // 36px - Section headings
--text-3xl: 1.875rem; // 30px - Subsection headings
--text-2xl: 1.5rem; // 24px - Card titles
--text-xl: 1.25rem; // 20px - Large text

// Body Text
--text-lg: 1.125rem; // 18px - Lead text
--text-base: 1rem; // 16px - Body text
--text-sm: 0.875rem; // 14px - Small text
--text-xs: 0.75rem; // 12px - Micro text

// Code & Technical
--text-code: 0.875rem; // 14px - Inline code
--text-mono: 0.8125rem; // 13px - Code blocks
```

### Font Weights

```scss
--font-light: 300; // Rare use, large display text
--font-normal: 400; // Default body text
--font-medium: 500; // Emphasis, labels
--font-semibold: 600; // Headings, important text
--font-bold: 700; // Strong emphasis, CTAs
```

### Line Heights

```scss
--leading-tight: 1.25; // Display text
--leading-snug: 1.375; // Headings
--leading-normal: 1.5; // Body text
--leading-relaxed: 1.625; // Long-form content
--leading-loose: 2; // Spaced content
```

---

## Spacing System

### Base Scale (rem-based)

```scss
// Micro spacing
--space-1: 0.25rem; // 4px
--space-2: 0.5rem; // 8px
--space-3: 0.75rem; // 12px
--space-4: 1rem; // 16px
--space-5: 1.25rem; // 20px
--space-6: 1.5rem; // 24px

// Standard spacing
--space-8: 2rem; // 32px
--space-10: 2.5rem; // 40px
--space-12: 3rem; // 48px
--space-16: 4rem; // 64px
--space-20: 5rem; // 80px
--space-24: 6rem; // 96px

// Large spacing
--space-32: 8rem; // 128px
--space-40: 10rem; // 160px
--space-48: 12rem; // 192px
--space-64: 16rem; // 256px
```

### Component Spacing

```scss
// Internal component spacing
--space-component-xs: var(--space-2); // 8px
--space-component-sm: var(--space-3); // 12px
--space-component-md: var(--space-4); // 16px
--space-component-lg: var(--space-6); // 24px
--space-component-xl: var(--space-8); // 32px

// Layout spacing
--space-layout-xs: var(--space-4); // 16px
--space-layout-sm: var(--space-6); // 24px
--space-layout-md: var(--space-8); // 32px
--space-layout-lg: var(--space-12); // 48px
--space-layout-xl: var(--space-16); // 64px
```

---

## Layout & Grid System

### Container Sizes

```scss
--container-sm: 640px; // Small screens
--container-md: 768px; // Medium screens
--container-lg: 1024px; // Large screens
--container-xl: 1280px; // Extra large screens
--container-2xl: 1536px; // Maximum width
```

### Breakpoints

```scss
--breakpoint-sm: 640px; // Small devices
--breakpoint-md: 768px; // Tablets
--breakpoint-lg: 1024px; // Laptops
--breakpoint-xl: 1280px; // Desktops
--breakpoint-2xl: 1536px; // Large desktops
```

### Grid System

```scss
// 12-column grid with flexible gaps
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-layout-md);
}

// Common responsive patterns
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-layout-sm);
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-layout-md);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-layout-lg);
  }
}
```

---

## Component Guidelines

### Buttons

```scss
// Primary button (Bitcoin actions)
.btn-primary {
  background: var(--bitcoin-orange);
  color: var(--zinc-950);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #e8970a;
  transform: translateY(-1px);
}

// Secondary button (Lightning actions)
.btn-secondary {
  background: var(--lightning-purple);
  color: var(--zinc-50);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

// Ghost button (Cypherpunk aesthetic)
.btn-ghost {
  background: transparent;
  color: var(--zinc-300);
  border: 1px solid var(--zinc-700);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--hover-overlay);
  border-color: var(--zinc-600);
}
```

### Cards

```scss
// Standard content card
.card {
  background: var(--zinc-900);
  border: 1px solid var(--zinc-800);
  border-radius: 0.75rem;
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--zinc-700);
  transform: translateY(-2px);
}

// Elevated card (important content)
.card-elevated {
  background: var(--zinc-900);
  border: 1px solid var(--zinc-700);
  border-radius: 0.75rem;
  padding: var(--space-6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

// Glass card (modern accent)
.card-glass {
  background: rgba(39, 39, 42, 0.8);
  border: 1px solid rgba(113, 113, 122, 0.2);
  border-radius: 0.75rem;
  padding: var(--space-6);
  backdrop-filter: blur(8px);
}
```

### Input Fields

```scss
// Standard input
.input {
  background: var(--zinc-900);
  border: 1px solid var(--zinc-700);
  border-radius: 0.5rem;
  padding: var(--space-3) var(--space-4);
  color: var(--zinc-100);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-color: var(--lightning-purple);
}

// Monospace input (for addresses, keys)
.input-mono {
  font-family: var(--font-mono);
  font-size: var(--text-mono);
  letter-spacing: 0.025em;
}
```

### Navigation

```scss
// Header navigation
.nav-header {
  background: rgba(9, 9, 11, 0.95);
  border-bottom: 1px solid var(--zinc-800);
  backdrop-filter: blur(8px);
  padding: var(--space-4) 0;
}

// Navigation links
.nav-link {
  color: var(--zinc-400);
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--zinc-100);
  background: var(--hover-overlay);
}

.nav-link.active {
  color: var(--bitcoin-orange);
  background: rgba(242, 169, 0, 0.1);
}
```

---

## Iconography

### Icon System

```scss
// Base icon styling
.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: currentColor;
  flex-shrink: 0;
}

// Icon sizes
.icon-xs {
  width: 1rem;
  height: 1rem;
}
.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}
.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}
.icon-lg {
  width: 2rem;
  height: 2rem;
}
.icon-xl {
  width: 2.5rem;
  height: 2.5rem;
}
```

### Semantic Icons

- **Bitcoin**: `₿` or Bitcoin symbol for payments
- **Lightning**: `⚡` for instant features
- **Nostr**: Custom purple icon for decentralized features
- **Security**: `🔒` for private/secure features
- **Code**: `</>` for technical content
- **Terminal**: `>_` for developer features

### Usage Guidelines

- Use icons consistently across similar functions
- Pair icons with text labels in primary navigation
- Use monochrome icons that inherit text color
- Reserve color icons for status indicators only

---

## Animation & Transitions

### Micro-interactions

```scss
// Standard transitions
.transition-standard {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// Hover transforms
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(123, 104, 238, 0.3);
}
```

### Page Transitions

- Fade transitions for page navigation
- Slide transitions for modal/drawer states
- Scale transitions for important state changes
- No unnecessary animation that delays user actions

---

## Accessibility Guidelines

### Color Contrast

- All text must meet WCAG AA standards (4.5:1 ratio)
- Important elements meet WCAG AAA standards (7:1 ratio)
- Color is never the only indicator of state or meaning

### Focus Management

- Visible focus rings on all interactive elements
- Logical tab order through all interfaces
- Focus trapping in modals and dialogs
- Skip links for keyboard navigation

### Screen Reader Support

- Semantic HTML structure throughout
- Proper ARIA labels and descriptions
- Alt text for all meaningful images
- Status announcements for dynamic content

---

## Responsive Design Patterns

### Mobile-First Approach

- Design for 320px minimum width
- Touch targets minimum 44px
- Generous spacing for touch interaction
- Simplified navigation for mobile

### Breakpoint Strategy

- **Mobile**: Single column, stacked navigation
- **Tablet**: Two-column grids, collapsible sidebar
- **Desktop**: Three-column layouts, persistent navigation
- **Large Desktop**: Maximum width with centered content

### Content Prioritization

- Most important content visible without scrolling
- Progressive disclosure for complex information
- Contextual menus for secondary actions
- Consistent interaction patterns across screen sizes

---

## Performance Guidelines

### Loading States

- Skeleton screens for content loading
- Progressive image loading with blur-up effect
- Immediate feedback for user actions
- Clear error states with recovery options

### Bundle Optimization

- Critical CSS inlined for above-the-fold content
- Dynamic imports for admin-only features
- Optimized images with next/image
- Minimal JavaScript for core functionality

---

## Configuration System

### Theme Variables

```json
{
  "colors": {
    "primary": "#F2A900",
    "secondary": "#7B68EE",
    "accent": "#8B5CF6",
    "neutral": "#71717A"
  },
  "typography": {
    "fontFamily": "Inter",
    "fontScale": "1rem",
    "lineHeight": "1.5"
  },
  "spacing": {
    "scale": "1rem",
    "componentBase": "16px",
    "layoutBase": "32px"
  },
  "components": {
    "buttons": {
      "borderRadius": "0.5rem",
      "padding": "0.75rem 1.5rem"
    },
    "cards": {
      "borderRadius": "0.75rem",
      "padding": "1.5rem"
    }
  }
}
```

### White-Label Customization

- Complete color palette override
- Typography stack replacement
- Component variant selection
- Layout pattern customization
- Brand asset integration

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Set up Tailwind CSS with custom design tokens
- [ ] Implement base component styles
- [ ] Create responsive grid system
- [ ] Set up typography scale
- [ ] Implement color palette

### Phase 2: Components

- [ ] Style all ShadCN/ui components
- [ ] Create custom component variants
- [ ] Implement interactive states
- [ ] Add animation and transitions
- [ ] Test accessibility compliance

### Phase 3: Theming

- [ ] Build configuration system
- [ ] Create theme variants
- [ ] Implement white-label support
- [ ] Add dark/light mode toggle
- [ ] Test across all breakpoints

---

This design system balances the technical, minimalist aesthetic of the cypherpunk movement with the usability requirements of a modern educational platform. The dark-first approach with strategic color usage creates a professional, trustworthy environment while maintaining the innovative spirit of the Bitcoin development community.
