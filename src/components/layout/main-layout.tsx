import { Header } from "./header"

/**
 * Main layout wrapper for all pages
 * Provides consistent structure with header and main content area
 */
interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 