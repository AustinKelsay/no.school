import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Section } from "@/components/layout/section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  Star, 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  Zap, 
  Shield, 
  Code, 
  Palette,
  Database,
  Smartphone,
  Globe
} from "lucide-react"

/**
 * Homepage component featuring hero section, course filters, and course grid
 * Demonstrates the developer education platform's offerings
 */
export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Section 
        spacing="xl" 
        className="bg-gradient-to-b from-background to-secondary/20"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Learn to code<br />
              Build on <span className="text-primary">Lightning</span><br />
              Become a dev
            </h1>
            
            <p className="max-w-md text-lg text-muted-foreground">
              A one of a kind developer education, content, and community platform 
              built on Nostr and fully Lightning integrated.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {['JD', 'SM', 'AL', 'TR', 'PK'].map((initials) => (
                  <Avatar key={initials} className="h-10 w-10 border-2 border-background">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">500+</div>
                <div className="text-muted-foreground">students enrolled</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">4.87</span>
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Learn To Code
            </Button>
          </div>
          
          <div className="relative">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Video className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground">Video Preview</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Filter Tags */}
      <Section spacing="sm" className="border-b">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="px-4 py-2">
            <Users className="mr-1 h-4 w-4" />
            Top
          </Badge>
          {[
            { icon: BookOpen, label: 'Courses' },
            { icon: Video, label: 'Videos' },
            { icon: FileText, label: 'Documents' },
            { icon: null, label: 'Free' },
            { icon: null, label: 'Paid' },
            { icon: Zap, label: 'lightning' },
            { icon: Shield, label: 'cheatsheet' },
            { icon: Code, label: 'rust' },
            { icon: null, label: 'beginner' },
            { icon: Palette, label: 'frontend' },
            { icon: null, label: 'guide' }
          ].map((tag) => (
            <Badge key={tag.label} variant="outline" className="px-4 py-2">
              {tag.icon && <tag.icon className="mr-1 h-4 w-4" />}
              {tag.label}
            </Badge>
          ))}
        </div>
      </Section>

      {/* Courses Section */}
      <Section spacing="lg">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Courses</h2>
          
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  title: "PlebDevs Starter",
                  description: "Get started with the fundamentals",
                  icon: Code,
                  gradient: "from-blue-500/20 to-purple-500/20"
                },
                {
                  title: "Frontend Course", 
                  description: "Build beautiful user interfaces",
                  icon: Palette,
                  gradient: "from-green-500/20 to-blue-500/20"
                },
                {
                  title: "Backend Course",
                  description: "Master server-side development", 
                  icon: Zap,
                  gradient: "from-yellow-500/20 to-red-500/20"
                },
                {
                  title: "Database Design",
                  description: "Learn to design efficient databases",
                  icon: Database,
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
                {
                  title: "Mobile Development",
                  description: "Build apps for iOS and Android",
                  icon: Smartphone,
                  gradient: "from-orange-500/20 to-red-500/20"
                },
                {
                  title: "Web3 Development",
                  description: "Build decentralized applications",
                  icon: Globe,
                  gradient: "from-cyan-500/20 to-blue-500/20"
                }
              ].map((course) => (
                <CarouselItem key={course.title} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden">
                    <div className={`aspect-video bg-gradient-to-br ${course.gradient} flex items-center justify-center p-6`}>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                          <course.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Section>

      {/* Videos Section */}
      <Section spacing="lg">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Videos</h2>
          
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  title: "Lightning Network Basics",
                  description: "Understanding the Lightning Network",
                  icon: Video,
                  gradient: "from-yellow-500/20 to-orange-500/20",
                  duration: "15:23"
                },
                {
                  title: "React Hook Deep Dive",
                  description: "Advanced React patterns and hooks",
                  icon: Video,
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  duration: "28:45"
                },
                {
                  title: "Node.js Performance Tips",
                  description: "Optimizing your Node.js applications",
                  icon: Video,
                  gradient: "from-green-500/20 to-teal-500/20",
                  duration: "22:10"
                },
                {
                  title: "TypeScript Best Practices",
                  description: "Writing better TypeScript code",
                  icon: Video,
                  gradient: "from-purple-500/20 to-indigo-500/20",
                  duration: "19:32"
                },
                {
                  title: "Database Optimization",
                  description: "Speed up your database queries",
                  icon: Video,
                  gradient: "from-red-500/20 to-pink-500/20",
                  duration: "31:15"
                },
                {
                  title: "API Design Patterns",
                  description: "Building scalable REST APIs",
                  icon: Video,
                  gradient: "from-indigo-500/20 to-purple-500/20",
                  duration: "24:18"
                }
              ].map((video) => (
                <CarouselItem key={video.title} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden">
                    <div className={`aspect-video bg-gradient-to-br ${video.gradient} flex items-center justify-center p-6`}>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                          <video.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{video.duration}</p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Section>

      {/* Documents Section */}
      <Section spacing="lg">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Documents</h2>
          
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  title: "JavaScript Cheatsheet",
                  description: "Quick reference for JavaScript syntax",
                  icon: FileText,
                  gradient: "from-amber-500/20 to-yellow-500/20",
                  type: "Cheatsheet"
                },
                {
                  title: "Lightning Development Guide",
                  description: "Complete guide to Lightning development",
                  icon: FileText,
                  gradient: "from-blue-500/20 to-indigo-500/20",
                  type: "Guide"
                },
                {
                  title: "React Testing Cookbook",
                  description: "Recipes for testing React components",
                  icon: FileText,
                  gradient: "from-green-500/20 to-emerald-500/20",
                  type: "Cookbook"
                },
                {
                  title: "API Security Checklist",
                  description: "Essential security measures for APIs",
                  icon: Shield,
                  gradient: "from-red-500/20 to-rose-500/20",
                  type: "Checklist"
                },
                {
                  title: "TypeScript Migration Guide",
                  description: "Step-by-step TypeScript migration",
                  icon: FileText,
                  gradient: "from-purple-500/20 to-violet-500/20",
                  type: "Guide"
                },
                {
                  title: "Docker Commands Reference",
                  description: "Essential Docker commands and examples",
                  icon: FileText,
                  gradient: "from-cyan-500/20 to-teal-500/20",
                  type: "Reference"
                }
              ].map((document) => (
                <CarouselItem key={document.title} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden">
                    <div className={`aspect-video bg-gradient-to-br ${document.gradient} flex items-center justify-center p-6`}>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                          <document.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{document.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{document.type}</p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{document.title}</CardTitle>
                      <CardDescription>{document.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Section>
    </MainLayout>
  )
}
