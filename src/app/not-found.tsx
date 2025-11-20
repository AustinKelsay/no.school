"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from "lucide-react"
import { copyConfig } from "@/lib/copy"

/**
 * 404 Not Found page component
 * Provides helpful navigation options when pages don't exist
 */
export default function NotFound() {
  const notFoundCopy = copyConfig.notFound
  const router = useRouter()

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{notFoundCopy.title}</CardTitle>
          <CardDescription>{notFoundCopy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {notFoundCopy.buttons.goHome}
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {notFoundCopy.buttons.goBack}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
