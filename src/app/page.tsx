import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HeroAnimated } from "@/components/ui/hero-animated"
import { MainLayout, Section } from "@/components/layout"
import { 
  BookOpen, 
  Video, 
  Zap, 
  Star,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
  CheckCircle
} from "lucide-react"

import { getAllContentItems } from "@/lib/data"
import { CoursesSection } from "@/components/homepage/courses-section"
import { VideosSection } from "@/components/homepage/videos-section"
import { DocumentsSection } from "@/components/homepage/documents-section"

interface HeroStat {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Homepage component showcasing content and features
 * Uses dynamic data fetching and caching for performance
 */
export default function Home() {
  const heroStats: HeroStat[] = [
    { value: "2,500+", label: "Students", icon: Users },
    { value: "50+", label: "Courses, Videos & Docs", icon: BookOpen },
    { value: "4.7/5", label: "Rating", icon: Star },
    { value: "24/7", label: "Support", icon: Clock },
  ]



  return (
    <MainLayout>
      {/* Hero Section */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-b from-background to-muted/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                Bitcoin Development Platform
              </Badge>
              
              <HeroAnimated />
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                Master the fundamentals of coding, build real projects on Bitcoin protocols, and join the next generation of developers shaping the future of money and communication.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {heroStats.map((stat, index) => (
                <div key={index} className="text-center space-y-1">
                  <div className="flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-primary mr-1" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 sm:flex-none">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                <Video className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground">⚡ Lightning Network Development</p>
              </div>
            </div>
            
            {/* Floating content type cards */}
            <div className="absolute -top-4 -right-4 z-10">
              <Card className="w-32 p-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-xs font-medium">Live Course</span>
                </div>
              </Card>
            </div>
            
            <div className="absolute -bottom-4 -left-4 z-10">
              <Card className="w-36 p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Completed</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Dynamic Content Sections */}
      <HomepageContent />
      
      {/* CTA Section */}
      <Section spacing="lg" className="bg-muted/50">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Ready to Start Building?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers learning Bitcoin development. Start your journey today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Courses
            </Button>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}

/**
 * Dynamic content sections with server-side data fetching
 * Shows featured courses, videos, and documents
 */
async function HomepageContent() {

  return (
    <>
      <CoursesSection />
      <VideosSection />
      <DocumentsSection />
    </>
  )
}
