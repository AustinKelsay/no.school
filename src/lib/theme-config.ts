/**
 * Comprehensive theme configuration for shadcn with style variants
 * Defines all available color schemes, style variants, and radius options
 * Based on shadcn/ui theming system
 */

export type ThemeColor = 
  | "neutral"
  | "stone" 
  | "slate"
  | "gray"
  | "zinc"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "amber"
  | "rose"
  | "purple"
  | "violet"
  | "orange"
  | "teal"

export type ThemeStyle = "default" | "new-york"

export type ThemeRadius = "none" | "small" | "medium" | "large" | "full"

export interface RadiusConfig {
  name: string
  value: ThemeRadius
  description: string
  cssValue: string
}

export interface StyleConfig {
  name: string
  value: ThemeStyle
  description: string
  className?: string
}

export interface ThemeConfig {
  name: string
  value: ThemeColor
  description: string
  lightColors: Record<string, string>
  darkColors: Record<string, string>
}

export interface FullThemeConfig {
  color: ThemeColor
  style: ThemeStyle
  radius: ThemeRadius
}

export const defaultTheme: FullThemeConfig = {
  color: "neutral",
  style: "new-york",
  radius: "medium",
}

export const radiusConfigs: RadiusConfig[] = [
  {
    name: "None",
    value: "none",
    description: "No rounded corners",
    cssValue: "0px",
  },
  {
    name: "Small",
    value: "small",
    description: "Subtle rounded corners",
    cssValue: "0.25rem",
  },
  {
    name: "Medium",
    value: "medium",
    description: "Balanced rounded corners",
    cssValue: "0.5rem",
  },
  {
    name: "Large",
    value: "large",
    description: "Prominent rounded corners",
    cssValue: "0.75rem",
  },
  {
    name: "Full",
    value: "full",
    description: "Maximum rounded corners",
    cssValue: "1rem",
  },
]

export const styleConfigs: StyleConfig[] = [
  {
    name: "Default",
    value: "default",
    description: "Modern rounded style",
    className: "style-default",
  },
  {
    name: "New York",
    value: "new-york",
    description: "Flat minimal style",
    className: "style-new-york",
  },
]

export const themeConfigs: ThemeConfig[] = [
  {
    name: "Neutral",
    value: "neutral",
    description: "Balanced gray tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.145 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.145 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.145 0 0)",
      "--primary": "oklch(0.205 0 0)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--secondary": "oklch(0.97 0 0)",
      "--secondary-foreground": "oklch(0.205 0 0)",
      "--muted": "oklch(0.97 0 0)",
      "--muted-foreground": "oklch(0.556 0 0)",
      "--accent": "oklch(0.97 0 0)",
      "--accent-foreground": "oklch(0.205 0 0)",
      "--border": "oklch(0.922 0 0)",
      "--input": "oklch(0.922 0 0)",
      "--ring": "oklch(0.708 0 0)",
    },
    darkColors: {
      "--background": "oklch(0.145 0 0)",
      "--foreground": "oklch(0.985 0 0)",
      "--card": "oklch(0.205 0 0)",
      "--card-foreground": "oklch(0.985 0 0)",
      "--popover": "oklch(0.205 0 0)",
      "--popover-foreground": "oklch(0.985 0 0)",
      "--primary": "oklch(0.922 0 0)",
      "--primary-foreground": "oklch(0.205 0 0)",
      "--secondary": "oklch(0.269 0 0)",
      "--secondary-foreground": "oklch(0.985 0 0)",
      "--muted": "oklch(0.269 0 0)",
      "--muted-foreground": "oklch(0.708 0 0)",
      "--accent": "oklch(0.269 0 0)",
      "--accent-foreground": "oklch(0.985 0 0)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.556 0 0)",
    }
  },
  {
    name: "Stone",
    value: "stone",
    description: "Warm natural tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 60.54)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 60.54)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 60.54)",
      "--primary": "oklch(0.205 0.005 60.54)",
      "--primary-foreground": "oklch(0.985 0.003 60.54)",
      "--secondary": "oklch(0.97 0.005 60.54)",
      "--secondary-foreground": "oklch(0.205 0.005 60.54)",
      "--muted": "oklch(0.97 0.005 60.54)",
      "--muted-foreground": "oklch(0.556 0.005 60.54)",
      "--accent": "oklch(0.97 0.005 60.54)",
      "--accent-foreground": "oklch(0.205 0.005 60.54)",
      "--border": "oklch(0.922 0.005 60.54)",
      "--input": "oklch(0.922 0.005 60.54)",
      "--ring": "oklch(0.708 0.005 60.54)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 60.54)",
      "--foreground": "oklch(0.985 0.003 60.54)",
      "--card": "oklch(0.205 0.005 60.54)",
      "--card-foreground": "oklch(0.985 0.003 60.54)",
      "--popover": "oklch(0.205 0.005 60.54)",
      "--popover-foreground": "oklch(0.985 0.003 60.54)",
      "--primary": "oklch(0.922 0.005 60.54)",
      "--primary-foreground": "oklch(0.205 0.005 60.54)",
      "--secondary": "oklch(0.269 0.005 60.54)",
      "--secondary-foreground": "oklch(0.985 0.003 60.54)",
      "--muted": "oklch(0.269 0.005 60.54)",
      "--muted-foreground": "oklch(0.708 0.005 60.54)",
      "--accent": "oklch(0.269 0.005 60.54)",
      "--accent-foreground": "oklch(0.985 0.003 60.54)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.556 0.005 60.54)",
    }
  },
  {
    name: "Slate",
    value: "slate",
    description: "Cool gray tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.129 0.042 264.695)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.129 0.042 264.695)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.129 0.042 264.695)",
      "--primary": "oklch(0.208 0.042 265.755)",
      "--primary-foreground": "oklch(0.984 0.003 247.858)",
      "--secondary": "oklch(0.968 0.007 247.896)",
      "--secondary-foreground": "oklch(0.208 0.042 265.755)",
      "--muted": "oklch(0.968 0.007 247.896)",
      "--muted-foreground": "oklch(0.554 0.046 257.417)",
      "--accent": "oklch(0.968 0.007 247.896)",
      "--accent-foreground": "oklch(0.208 0.042 265.755)",
      "--border": "oklch(0.929 0.013 255.508)",
      "--input": "oklch(0.929 0.013 255.508)",
      "--ring": "oklch(0.704 0.04 256.788)",
    },
    darkColors: {
      "--background": "oklch(0.129 0.042 264.695)",
      "--foreground": "oklch(0.984 0.003 247.858)",
      "--card": "oklch(0.208 0.042 265.755)",
      "--card-foreground": "oklch(0.984 0.003 247.858)",
      "--popover": "oklch(0.208 0.042 265.755)",
      "--popover-foreground": "oklch(0.984 0.003 247.858)",
      "--primary": "oklch(0.929 0.013 255.508)",
      "--primary-foreground": "oklch(0.208 0.042 265.755)",
      "--secondary": "oklch(0.279 0.041 260.031)",
      "--secondary-foreground": "oklch(0.984 0.003 247.858)",
      "--muted": "oklch(0.279 0.041 260.031)",
      "--muted-foreground": "oklch(0.704 0.04 256.788)",
      "--accent": "oklch(0.279 0.041 260.031)",
      "--accent-foreground": "oklch(0.984 0.003 247.858)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.551 0.027 264.364)",
    }
  },
  {
    name: "Gray",
    value: "gray",
    description: "True gray tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 0)",
      "--primary": "oklch(0.205 0.005 0)",
      "--primary-foreground": "oklch(0.985 0.003 0)",
      "--secondary": "oklch(0.97 0.005 0)",
      "--secondary-foreground": "oklch(0.205 0.005 0)",
      "--muted": "oklch(0.97 0.005 0)",
      "--muted-foreground": "oklch(0.556 0.005 0)",
      "--accent": "oklch(0.97 0.005 0)",
      "--accent-foreground": "oklch(0.205 0.005 0)",
      "--border": "oklch(0.922 0.005 0)",
      "--input": "oklch(0.922 0.005 0)",
      "--ring": "oklch(0.708 0.005 0)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 0)",
      "--foreground": "oklch(0.985 0.003 0)",
      "--card": "oklch(0.205 0.005 0)",
      "--card-foreground": "oklch(0.985 0.003 0)",
      "--popover": "oklch(0.205 0.005 0)",
      "--popover-foreground": "oklch(0.985 0.003 0)",
      "--primary": "oklch(0.922 0.005 0)",
      "--primary-foreground": "oklch(0.205 0.005 0)",
      "--secondary": "oklch(0.269 0.005 0)",
      "--secondary-foreground": "oklch(0.985 0.003 0)",
      "--muted": "oklch(0.269 0.005 0)",
      "--muted-foreground": "oklch(0.708 0.005 0)",
      "--accent": "oklch(0.269 0.005 0)",
      "--accent-foreground": "oklch(0.985 0.003 0)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.556 0.005 0)",
    }
  },
  {
    name: "Zinc",
    value: "zinc",
    description: "Neutral zinc tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 240)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 240)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 240)",
      "--primary": "oklch(0.205 0.005 240)",
      "--primary-foreground": "oklch(0.985 0.003 240)",
      "--secondary": "oklch(0.97 0.005 240)",
      "--secondary-foreground": "oklch(0.205 0.005 240)",
      "--muted": "oklch(0.97 0.005 240)",
      "--muted-foreground": "oklch(0.556 0.005 240)",
      "--accent": "oklch(0.97 0.005 240)",
      "--accent-foreground": "oklch(0.205 0.005 240)",
      "--border": "oklch(0.922 0.005 240)",
      "--input": "oklch(0.922 0.005 240)",
      "--ring": "oklch(0.708 0.005 240)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 240)",
      "--foreground": "oklch(0.985 0.003 240)",
      "--card": "oklch(0.205 0.005 240)",
      "--card-foreground": "oklch(0.985 0.003 240)",
      "--popover": "oklch(0.205 0.005 240)",
      "--popover-foreground": "oklch(0.985 0.003 240)",
      "--primary": "oklch(0.922 0.005 240)",
      "--primary-foreground": "oklch(0.205 0.005 240)",
      "--secondary": "oklch(0.269 0.005 240)",
      "--secondary-foreground": "oklch(0.985 0.003 240)",
      "--muted": "oklch(0.269 0.005 240)",
      "--muted-foreground": "oklch(0.708 0.005 240)",
      "--accent": "oklch(0.269 0.005 240)",
      "--accent-foreground": "oklch(0.985 0.003 240)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.556 0.005 240)",
    }
  },
  {
    name: "Blue",
    value: "blue",
    description: "Professional blue tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 240)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 240)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 240)",
      "--primary": "oklch(0.648 0.148 240)",
      "--primary-foreground": "oklch(0.985 0.003 240)",
      "--secondary": "oklch(0.97 0.005 240)",
      "--secondary-foreground": "oklch(0.205 0.005 240)",
      "--muted": "oklch(0.97 0.005 240)",
      "--muted-foreground": "oklch(0.556 0.005 240)",
      "--accent": "oklch(0.97 0.005 240)",
      "--accent-foreground": "oklch(0.205 0.005 240)",
      "--border": "oklch(0.922 0.005 240)",
      "--input": "oklch(0.922 0.005 240)",
      "--ring": "oklch(0.648 0.148 240)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 240)",
      "--foreground": "oklch(0.985 0.003 240)",
      "--card": "oklch(0.205 0.005 240)",
      "--card-foreground": "oklch(0.985 0.003 240)",
      "--popover": "oklch(0.205 0.005 240)",
      "--popover-foreground": "oklch(0.985 0.003 240)",
      "--primary": "oklch(0.648 0.148 240)",
      "--primary-foreground": "oklch(0.985 0.003 240)",
      "--secondary": "oklch(0.269 0.005 240)",
      "--secondary-foreground": "oklch(0.985 0.003 240)",
      "--muted": "oklch(0.269 0.005 240)",
      "--muted-foreground": "oklch(0.708 0.005 240)",
      "--accent": "oklch(0.269 0.005 240)",
      "--accent-foreground": "oklch(0.985 0.003 240)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.648 0.148 240)",
    }
  },
  {
    name: "Red",
    value: "red",
    description: "Vibrant red tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 0)",
      "--primary": "oklch(0.577 0.245 27.325)",
      "--primary-foreground": "oklch(0.985 0.003 0)",
      "--secondary": "oklch(0.97 0.005 0)",
      "--secondary-foreground": "oklch(0.205 0.005 0)",
      "--muted": "oklch(0.97 0.005 0)",
      "--muted-foreground": "oklch(0.556 0.005 0)",
      "--accent": "oklch(0.97 0.005 0)",
      "--accent-foreground": "oklch(0.205 0.005 0)",
      "--border": "oklch(0.922 0.005 0)",
      "--input": "oklch(0.922 0.005 0)",
      "--ring": "oklch(0.577 0.245 27.325)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 0)",
      "--foreground": "oklch(0.985 0.003 0)",
      "--card": "oklch(0.205 0.005 0)",
      "--card-foreground": "oklch(0.985 0.003 0)",
      "--popover": "oklch(0.205 0.005 0)",
      "--popover-foreground": "oklch(0.985 0.003 0)",
      "--primary": "oklch(0.577 0.245 27.325)",
      "--primary-foreground": "oklch(0.985 0.003 0)",
      "--secondary": "oklch(0.269 0.005 0)",
      "--secondary-foreground": "oklch(0.985 0.003 0)",
      "--muted": "oklch(0.269 0.005 0)",
      "--muted-foreground": "oklch(0.708 0.005 0)",
      "--accent": "oklch(0.269 0.005 0)",
      "--accent-foreground": "oklch(0.985 0.003 0)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.577 0.245 27.325)",
    }
  },
  {
    name: "Green",
    value: "green",
    description: "Fresh green tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 120)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 120)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 120)",
      "--primary": "oklch(0.548 0.148 120)",
      "--primary-foreground": "oklch(0.985 0.003 120)",
      "--secondary": "oklch(0.97 0.005 120)",
      "--secondary-foreground": "oklch(0.205 0.005 120)",
      "--muted": "oklch(0.97 0.005 120)",
      "--muted-foreground": "oklch(0.556 0.005 120)",
      "--accent": "oklch(0.97 0.005 120)",
      "--accent-foreground": "oklch(0.205 0.005 120)",
      "--border": "oklch(0.922 0.005 120)",
      "--input": "oklch(0.922 0.005 120)",
      "--ring": "oklch(0.548 0.148 120)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 120)",
      "--foreground": "oklch(0.985 0.003 120)",
      "--card": "oklch(0.205 0.005 120)",
      "--card-foreground": "oklch(0.985 0.003 120)",
      "--popover": "oklch(0.205 0.005 120)",
      "--popover-foreground": "oklch(0.985 0.003 120)",
      "--primary": "oklch(0.548 0.148 120)",
      "--primary-foreground": "oklch(0.985 0.003 120)",
      "--secondary": "oklch(0.269 0.005 120)",
      "--secondary-foreground": "oklch(0.985 0.003 120)",
      "--muted": "oklch(0.269 0.005 120)",
      "--muted-foreground": "oklch(0.708 0.005 120)",
      "--accent": "oklch(0.269 0.005 120)",
      "--accent-foreground": "oklch(0.985 0.003 120)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.548 0.148 120)",
    }
  },
  {
    name: "Yellow",
    value: "yellow",
    description: "Bright yellow tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 60)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 60)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 60)",
      "--primary": "oklch(0.8 0.2 60)",
      "--primary-foreground": "oklch(0.145 0.005 60)",
      "--secondary": "oklch(0.97 0.005 60)",
      "--secondary-foreground": "oklch(0.205 0.005 60)",
      "--muted": "oklch(0.97 0.005 60)",
      "--muted-foreground": "oklch(0.556 0.005 60)",
      "--accent": "oklch(0.97 0.005 60)",
      "--accent-foreground": "oklch(0.205 0.005 60)",
      "--border": "oklch(0.922 0.005 60)",
      "--input": "oklch(0.922 0.005 60)",
      "--ring": "oklch(0.8 0.2 60)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 60)",
      "--foreground": "oklch(0.985 0.003 60)",
      "--card": "oklch(0.205 0.005 60)",
      "--card-foreground": "oklch(0.985 0.003 60)",
      "--popover": "oklch(0.205 0.005 60)",
      "--popover-foreground": "oklch(0.985 0.003 60)",
      "--primary": "oklch(0.8 0.2 60)",
      "--primary-foreground": "oklch(0.145 0.005 60)",
      "--secondary": "oklch(0.269 0.005 60)",
      "--secondary-foreground": "oklch(0.985 0.003 60)",
      "--muted": "oklch(0.269 0.005 60)",
      "--muted-foreground": "oklch(0.708 0.005 60)",
      "--accent": "oklch(0.269 0.005 60)",
      "--accent-foreground": "oklch(0.985 0.003 60)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.8 0.2 60)",
    }
  },
  {
    name: "Amber",
    value: "amber",
    description: "Warm amber tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 50)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 50)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 50)",
      "--primary": "oklch(0.648 0.148 50)",
      "--primary-foreground": "oklch(0.985 0.003 50)",
      "--secondary": "oklch(0.97 0.005 50)",
      "--secondary-foreground": "oklch(0.205 0.005 50)",
      "--muted": "oklch(0.97 0.005 50)",
      "--muted-foreground": "oklch(0.556 0.005 50)",
      "--accent": "oklch(0.97 0.005 50)",
      "--accent-foreground": "oklch(0.205 0.005 50)",
      "--border": "oklch(0.922 0.005 50)",
      "--input": "oklch(0.922 0.005 50)",
      "--ring": "oklch(0.648 0.148 50)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 50)",
      "--foreground": "oklch(0.985 0.003 50)",
      "--card": "oklch(0.205 0.005 50)",
      "--card-foreground": "oklch(0.985 0.003 50)",
      "--popover": "oklch(0.205 0.005 50)",
      "--popover-foreground": "oklch(0.985 0.003 50)",
      "--primary": "oklch(0.648 0.148 50)",
      "--primary-foreground": "oklch(0.985 0.003 50)",
      "--secondary": "oklch(0.269 0.005 50)",
      "--secondary-foreground": "oklch(0.985 0.003 50)",
      "--muted": "oklch(0.269 0.005 50)",
      "--muted-foreground": "oklch(0.708 0.005 50)",
      "--accent": "oklch(0.269 0.005 50)",
      "--accent-foreground": "oklch(0.985 0.003 50)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.648 0.148 50)",
    }
  },
  {
    name: "Rose",
    value: "rose",
    description: "Romantic rose tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 330)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 330)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 330)",
      "--primary": "oklch(0.648 0.148 330)",
      "--primary-foreground": "oklch(0.985 0.003 330)",
      "--secondary": "oklch(0.97 0.005 330)",
      "--secondary-foreground": "oklch(0.205 0.005 330)",
      "--muted": "oklch(0.97 0.005 330)",
      "--muted-foreground": "oklch(0.556 0.005 330)",
      "--accent": "oklch(0.97 0.005 330)",
      "--accent-foreground": "oklch(0.205 0.005 330)",
      "--border": "oklch(0.922 0.005 330)",
      "--input": "oklch(0.922 0.005 330)",
      "--ring": "oklch(0.648 0.148 330)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 330)",
      "--foreground": "oklch(0.985 0.003 330)",
      "--card": "oklch(0.205 0.005 330)",
      "--card-foreground": "oklch(0.985 0.003 330)",
      "--popover": "oklch(0.205 0.005 330)",
      "--popover-foreground": "oklch(0.985 0.003 330)",
      "--primary": "oklch(0.648 0.148 330)",
      "--primary-foreground": "oklch(0.985 0.003 330)",
      "--secondary": "oklch(0.269 0.005 330)",
      "--secondary-foreground": "oklch(0.985 0.003 330)",
      "--muted": "oklch(0.269 0.005 330)",
      "--muted-foreground": "oklch(0.708 0.005 330)",
      "--accent": "oklch(0.269 0.005 330)",
      "--accent-foreground": "oklch(0.985 0.003 330)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.648 0.148 330)",
    }
  },
  {
    name: "Purple",
    value: "purple",
    description: "Rich purple tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 270)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 270)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 270)",
      "--primary": "oklch(0.648 0.148 270)",
      "--primary-foreground": "oklch(0.985 0.003 270)",
      "--secondary": "oklch(0.97 0.005 270)",
      "--secondary-foreground": "oklch(0.205 0.005 270)",
      "--muted": "oklch(0.97 0.005 270)",
      "--muted-foreground": "oklch(0.556 0.005 270)",
      "--accent": "oklch(0.97 0.005 270)",
      "--accent-foreground": "oklch(0.205 0.005 270)",
      "--border": "oklch(0.922 0.005 270)",
      "--input": "oklch(0.922 0.005 270)",
      "--ring": "oklch(0.648 0.148 270)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 270)",
      "--foreground": "oklch(0.985 0.003 270)",
      "--card": "oklch(0.205 0.005 270)",
      "--card-foreground": "oklch(0.985 0.003 270)",
      "--popover": "oklch(0.205 0.005 270)",
      "--popover-foreground": "oklch(0.985 0.003 270)",
      "--primary": "oklch(0.648 0.148 270)",
      "--primary-foreground": "oklch(0.985 0.003 270)",
      "--secondary": "oklch(0.269 0.005 270)",
      "--secondary-foreground": "oklch(0.985 0.003 270)",
      "--muted": "oklch(0.269 0.005 270)",
      "--muted-foreground": "oklch(0.708 0.005 270)",
      "--accent": "oklch(0.269 0.005 270)",
      "--accent-foreground": "oklch(0.985 0.003 270)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.648 0.148 270)",
    }
  },
  {
    name: "Violet",
    value: "violet",
    description: "Deep violet tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 285)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 285)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 285)",
      "--primary": "oklch(0.55 0.18 285)",
      "--primary-foreground": "oklch(0.985 0.003 285)",
      "--secondary": "oklch(0.97 0.005 285)",
      "--secondary-foreground": "oklch(0.205 0.005 285)",
      "--muted": "oklch(0.97 0.005 285)",
      "--muted-foreground": "oklch(0.556 0.005 285)",
      "--accent": "oklch(0.97 0.005 285)",
      "--accent-foreground": "oklch(0.205 0.005 285)",
      "--border": "oklch(0.922 0.005 285)",
      "--input": "oklch(0.922 0.005 285)",
      "--ring": "oklch(0.55 0.18 285)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 285)",
      "--foreground": "oklch(0.985 0.003 285)",
      "--card": "oklch(0.205 0.005 285)",
      "--card-foreground": "oklch(0.985 0.003 285)",
      "--popover": "oklch(0.205 0.005 285)",
      "--popover-foreground": "oklch(0.985 0.003 285)",
      "--primary": "oklch(0.55 0.18 285)",
      "--primary-foreground": "oklch(0.985 0.003 285)",
      "--secondary": "oklch(0.269 0.005 285)",
      "--secondary-foreground": "oklch(0.985 0.003 285)",
      "--muted": "oklch(0.269 0.005 285)",
      "--muted-foreground": "oklch(0.708 0.005 285)",
      "--accent": "oklch(0.269 0.005 285)",
      "--accent-foreground": "oklch(0.985 0.003 285)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.55 0.18 285)",
    }
  },
  {
    name: "Orange",
    value: "orange",
    description: "Vibrant orange tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 30)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 30)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 30)",
      "--primary": "oklch(0.648 0.148 30)",
      "--primary-foreground": "oklch(0.985 0.003 30)",
      "--secondary": "oklch(0.97 0.005 30)",
      "--secondary-foreground": "oklch(0.205 0.005 30)",
      "--muted": "oklch(0.97 0.005 30)",
      "--muted-foreground": "oklch(0.556 0.005 30)",
      "--accent": "oklch(0.97 0.005 30)",
      "--accent-foreground": "oklch(0.205 0.005 30)",
      "--border": "oklch(0.922 0.005 30)",
      "--input": "oklch(0.922 0.005 30)",
      "--ring": "oklch(0.648 0.148 30)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 30)",
      "--foreground": "oklch(0.985 0.003 30)",
      "--card": "oklch(0.205 0.005 30)",
      "--card-foreground": "oklch(0.985 0.003 30)",
      "--popover": "oklch(0.205 0.005 30)",
      "--popover-foreground": "oklch(0.985 0.003 30)",
      "--primary": "oklch(0.648 0.148 30)",
      "--primary-foreground": "oklch(0.985 0.003 30)",
      "--secondary": "oklch(0.269 0.005 30)",
      "--secondary-foreground": "oklch(0.985 0.003 30)",
      "--muted": "oklch(0.269 0.005 30)",
      "--muted-foreground": "oklch(0.708 0.005 30)",
      "--accent": "oklch(0.269 0.005 30)",
      "--accent-foreground": "oklch(0.985 0.003 30)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.648 0.148 30)",
    }
  },
  {
    name: "Teal",
    value: "teal",
    description: "Cool teal tones",
    lightColors: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.146 0.005 180)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.146 0.005 180)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.146 0.005 180)",
      "--primary": "oklch(0.548 0.148 180)",
      "--primary-foreground": "oklch(0.985 0.003 180)",
      "--secondary": "oklch(0.97 0.005 180)",
      "--secondary-foreground": "oklch(0.205 0.005 180)",
      "--muted": "oklch(0.97 0.005 180)",
      "--muted-foreground": "oklch(0.556 0.005 180)",
      "--accent": "oklch(0.97 0.005 180)",
      "--accent-foreground": "oklch(0.205 0.005 180)",
      "--border": "oklch(0.922 0.005 180)",
      "--input": "oklch(0.922 0.005 180)",
      "--ring": "oklch(0.548 0.148 180)",
    },
    darkColors: {
      "--background": "oklch(0.145 0.005 180)",
      "--foreground": "oklch(0.985 0.003 180)",
      "--card": "oklch(0.205 0.005 180)",
      "--card-foreground": "oklch(0.985 0.003 180)",
      "--popover": "oklch(0.205 0.005 180)",
      "--popover-foreground": "oklch(0.985 0.003 180)",
      "--primary": "oklch(0.548 0.148 180)",
      "--primary-foreground": "oklch(0.985 0.003 180)",
      "--secondary": "oklch(0.269 0.005 180)",
      "--secondary-foreground": "oklch(0.985 0.003 180)",
      "--muted": "oklch(0.269 0.005 180)",
      "--muted-foreground": "oklch(0.708 0.005 180)",
      "--accent": "oklch(0.269 0.005 180)",
      "--accent-foreground": "oklch(0.985 0.003 180)",
      "--border": "oklch(1 0 0 / 10%)",
      "--input": "oklch(1 0 0 / 15%)",
      "--ring": "oklch(0.548 0.148 180)",
    }
  },
]

/**
 * Apply theme colors to the document root
 */
export function applyTheme(config: ThemeConfig, isDark: boolean = false) {
  const root = document.documentElement
  const colors = isDark ? config.darkColors : config.lightColors
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

/**
 * Apply theme style to the document root
 */
export function applyThemeStyle(style: ThemeStyle) {
  const root = document.documentElement
  
  // Remove existing style classes
  styleConfigs.forEach(config => {
    if (config.className) {
      root.classList.remove(config.className)
    }
  })
  
  // Add new style class
  const styleConfig = styleConfigs.find(config => config.value === style)
  if (styleConfig && styleConfig.className) {
    root.classList.add(styleConfig.className)
  }
}

/**
 * Apply theme radius to the document root
 */
export function applyThemeRadius(radius: ThemeRadius) {
  const root = document.documentElement
  const radiusConfig = radiusConfigs.find(config => config.value === radius)
  
  if (radiusConfig) {
    root.style.setProperty('--radius', radiusConfig.cssValue)
  }
}

/**
 * Apply full theme configuration
 */
export function applyFullTheme(themeConfig: FullThemeConfig, isDark: boolean = false) {
  const colorConfig = getThemeConfig(themeConfig.color)
  if (colorConfig) {
    applyTheme(colorConfig, isDark)
  }
  applyThemeStyle(themeConfig.style)
  applyThemeRadius(themeConfig.radius)
}

/**
 * Get theme config by value
 */
export function getThemeConfig(value: ThemeColor): ThemeConfig | undefined {
  return themeConfigs.find(config => config.value === value)
}

/**
 * Get style config by value
 */
export function getStyleConfig(value: ThemeStyle): StyleConfig | undefined {
  return styleConfigs.find(config => config.value === value)
}

/**
 * Get radius config by value
 */
export function getRadiusConfig(value: ThemeRadius): RadiusConfig | undefined {
  return radiusConfigs.find(config => config.value === value)
} 