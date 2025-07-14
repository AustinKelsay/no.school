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

/**
 * Header component for the main navigation
 * Features brand logo, search functionality, and authentication
 * Uses Container component for consistent spacing with page content
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center">
        {/* Left Section */}
        <div className="flex flex-1 items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PlebDevs</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Content</DropdownMenuItem>
              <DropdownMenuItem>Feeds</DropdownMenuItem>
              <DropdownMenuItem>Subscribe</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centered Search Bar */}
        <div className="flex flex-none justify-center px-4 lg:px-6">
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search content"
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Right-aligned Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeSelector />
          <ThemeToggle />
          <Button size="sm">Login</Button>
        </div>
      </Container>
    </header>
  )
} 