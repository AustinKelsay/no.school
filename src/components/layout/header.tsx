import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Zap } from "lucide-react"
import { Container } from "./container"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"

/**
 * Header component for the main navigation
 * Features brand logo, search functionality, and authentication
 * Uses Container component for consistent spacing with page content
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PlebDevs</span>
        </div>
        
        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search content" 
              className="w-80 pl-10" 
            />
          </div>
          <ThemeSelector />
          <ThemeToggle />
          <Button size="sm">Login</Button>
        </div>
      </Container>
    </header>
  )
} 