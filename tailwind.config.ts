import type { Config } from 'tailwindcss';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Bitcoin & Lightning Brand Colors
        'bitcoin-orange': '#F2A900',
        'lightning-purple': '#7B68EE',
        'nostr-purple': '#8B5CF6',

        // Zinc scale (dark-first)
        zinc: {
          '50': '#FAFAFA',
          '100': '#F4F4F5',
          '200': '#E4E4E7',
          '300': '#D4D4D8',
          '400': '#A1A1AA',
          '500': '#71717A',
          '600': '#52525B',
          '700': '#3F3F46',
          '800': '#27272A',
          '900': '#18181B',
          '950': '#09090B',
        },

        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Semantic backgrounds
        'success-bg': '#064E3B',
        'warning-bg': '#78350F',
        'error-bg': '#7F1D1D',
        'info-bg': '#1E3A8A',

        // Design system compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SF Mono',
          'Consolas',
          'monospace',
        ],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display & Headings
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.375' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        xl: ['1.25rem', { lineHeight: '1.375' }],

        // Body text
        lg: ['1.125rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        xs: ['0.75rem', { lineHeight: '1.5' }],

        // Code & Technical
        code: ['0.875rem', { lineHeight: '1.5' }],
        mono: ['0.8125rem', { lineHeight: '1.5' }],
      },

      spacing: {
        // Component spacing
        'component-xs': '0.5rem', // 8px
        'component-sm': '0.75rem', // 12px
        'component-md': '1rem', // 16px
        'component-lg': '1.5rem', // 24px
        'component-xl': '2rem', // 32px

        // Layout spacing
        'layout-xs': '1rem', // 16px
        'layout-sm': '1.5rem', // 24px
        'layout-md': '2rem', // 32px
        'layout-lg': '3rem', // 48px
        'layout-xl': '4rem', // 64px
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
