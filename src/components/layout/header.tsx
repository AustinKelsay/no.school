import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Zap } from "lucide-react"
import { Container } from "./container"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { FontToggle } from "@/components/font-toggle"
import Link from "next/link"
import { useCopy } from "@/lib/copy"
import { shouldShowThemeSelector, shouldShowFontToggle, shouldShowThemeToggle } from "@/lib/theme-ui-config"

/**
 * Header component for the main navigation
 * Features brand logo, search functionality, and authentication
 * Uses Container component for consistent spacing with page content
 */
export function Header() {
  const { site, navigation } = useCopy()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center">
        {/* Left Section */}
        <div className="flex flex-1 items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">{site.brandName}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>{navigation.menuItems.content}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.feeds}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.subscribe}</DropdownMenuItem>
              <DropdownMenuItem>{navigation.menuItems.about}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centered Search Bar */}
        <div className="flex flex-none justify-center px-4 lg:px-6">
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={navigation.searchPlaceholder}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Right-aligned Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {shouldShowThemeSelector() && <ThemeSelector />}
          {shouldShowFontToggle() && <FontToggle />}
          {shouldShowThemeToggle() && <ThemeToggle />}
          <Button size="sm">{navigation.buttons.login}</Button>
        </div>
      </Container>
    </header>
  )
} 