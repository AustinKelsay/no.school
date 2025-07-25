'use client'

import React, { Suspense, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DraftBadge, DraftPreviewBadge } from '@/components/ui/draft-badge'
import { DraftBanner, DraftActions } from '@/components/ui/draft-banner'
import { Progress } from '@/components/ui/progress'
import { MainLayout } from '@/components/layout/main-layout'
import { Section } from '@/components/layout/section'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { VideoPlayer } from '@/components/ui/video-player'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  User, 
  Calendar, 
  PlayCircle, 
  BookOpen, 
  Video, 
  FileText,
  RotateCcw,
  Edit,
  Share,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface LessonDraftPreviewPageClientProps {
  courseId: string
  lessonId: string
}

// Mock draft data
const mockCourseDraft = {
  id: 'draft-course-1',
  title: 'Bitcoin Development Fundamentals',
  category: 'bitcoin',
  draftLessons: [
    {
      id: 'lesson-1',
      title: 'Introduction to Bitcoin',
      index: 0,
      duration: '30 min',
      isPremium: false,
      type: 'document'
    },
    {
      id: 'lesson-2', 
      title: 'Bitcoin Script Basics',
      index: 1,
      duration: '45 min',
      isPremium: false,
      type: 'video'
    },
    {
      id: 'lesson-3',
      title: 'Building Your First Bitcoin App',
      index: 2,
      duration: '60 min', 
      isPremium: true,
      type: 'document'
    }
  ]
}

const mockLessonDraft = {
  id: 'lesson-1',
  title: 'Introduction to Bitcoin',
  summary: 'Learn the fundamentals of Bitcoin including its history, key principles, and how it works.',
  content: `# Introduction to Bitcoin

Welcome to your first lesson in Bitcoin development! In this lesson, we'll cover the fundamentals of Bitcoin and lay the groundwork for your development journey.

## What is Bitcoin?

Bitcoin is a peer-to-peer electronic cash system that allows online payments to be sent directly from one party to another without going through a financial institution.

### Key Properties of Bitcoin

1. **Decentralized**: No central authority controls Bitcoin
2. **Peer-to-Peer**: Direct transactions between users
3. **Immutable**: Transaction history cannot be changed
4. **Transparent**: All transactions are publicly visible
5. **Scarce**: Limited supply of 21 million bitcoins

## Bitcoin's History

Bitcoin was created by an anonymous person or group known as Satoshi Nakamoto. Here's a brief timeline:

- **2008**: Bitcoin whitepaper published
- **2009**: First Bitcoin software released
- **2010**: First commercial Bitcoin transaction
- **2017**: SegWit activation
- **2021**: Lightning Network growth

## How Bitcoin Works

Bitcoin operates on a blockchain - a distributed ledger that records all transactions. Here's a simplified overview:

### 1. Transactions

When you send Bitcoin, you create a transaction that:
- References previous transactions (inputs)
- Specifies where Bitcoin should go (outputs)  
- Includes a digital signature proving ownership

\`\`\`
Transaction Structure:
- Version
- Inputs (previous transaction references)
- Outputs (new ownership assignments)
- Locktime
\`\`\`

### 2. Mining

Miners compete to:
- Collect pending transactions
- Verify their validity
- Package them into blocks
- Solve a computational puzzle
- Add the block to the blockchain

### 3. Consensus

The network agrees on transaction validity through:
- Proof of Work consensus mechanism
- Longest valid chain rule
- Network-wide verification

## Bitcoin Script

Bitcoin uses a simple scripting language for transaction validation:

\`\`\`javascript
// Example: Pay to Public Key Hash (P2PKH)
OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
\`\`\`

This script:
1. Duplicates the public key
2. Hashes it
3. Compares to the provided hash
4. Verifies the signature

## Development Environment

To start developing with Bitcoin, you'll need:

### Essential Tools

1. **Bitcoin Core**: Full node implementation
2. **Testnet**: Safe testing environment  
3. **Block Explorer**: View blockchain data
4. **Programming Libraries**: bitcoinjs, btclib, etc.

### Setting Up

\`\`\`bash
# Install Bitcoin Core
wget https://bitcoin.org/bin/bitcoin-core-24.0/
tar -xzf bitcoin-24.0-x86_64-linux-gnu.tar.gz

# Start in testnet mode
./bitcoind -testnet -daemon

# Create a wallet
./bitcoin-cli -testnet createwallet "test_wallet"
\`\`\`

## Your First Bitcoin Address

Let's generate your first Bitcoin address:

\`\`\`bash
# Generate a new address
./bitcoin-cli -testnet getnewaddress

# Get your wallet info
./bitcoin-cli -testnet getwalletinfo
\`\`\`

Bitcoin addresses are derived from public keys through a series of cryptographic operations.

## Transaction Verification

Understanding how Bitcoin verifies transactions is crucial:

1. **Signature Verification**: Proves ownership
2. **Input Validation**: Ensures coins exist
3. **Double-Spend Prevention**: One coin, one spend
4. **Script Execution**: Validates spending conditions

## Network Effects

Bitcoin's value comes from its network effects:

- **Users**: More users = more utility
- **Merchants**: More acceptance = more value
- **Developers**: More development = better infrastructure
- **Miners**: More security = more trust

## Common Misconceptions

Let's address some common Bitcoin myths:

### "Bitcoin is anonymous"
- Bitcoin is pseudonymous, not anonymous
- All transactions are publicly visible
- Addresses can potentially be linked to identities

### "Bitcoin wastes energy"
- Mining secures the network
- Energy use is proportional to security
- Bitcoin incentivizes renewable energy

### "Bitcoin is too slow"
- Base layer prioritizes security over speed
- Layer 2 solutions like Lightning enable instant payments
- Different layers serve different purposes

## Next Steps

In our next lesson, we'll dive deeper into:

- Bitcoin Script and smart contracts
- Transaction construction
- Wallet development basics
- Testing with testnet

## Key Takeaways

1. Bitcoin is a decentralized digital currency
2. Blockchain provides immutable transaction history
3. Mining secures the network through proof of work
4. Script language enables programmable money
5. Development requires understanding of cryptography and networking

## Exercises

Try these exercises to reinforce your learning:

1. Set up a Bitcoin testnet node
2. Generate 5 new addresses
3. Use a block explorer to examine recent transactions
4. Read the original Bitcoin whitepaper

## Resources

- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Bitcoin Developer Documentation](https://developer.bitcoin.org/)
- [Mastering Bitcoin Book](https://github.com/bitcoinbook/bitcoinbook)
- [Bitcoin Testnet Faucet](https://testnet-faucet.mempool.co/)

Great work completing your first lesson! You now have a solid foundation in Bitcoin fundamentals. In the next lesson, we'll start exploring Bitcoin Script and how to build custom transaction types.`,
  type: 'document',
  duration: '30 min',
  isPremium: false,
  difficulty: 'beginner',
  index: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: 'Bitcoin Expert',
  authorPubkey: 'npub1...'
}

/**
 * Loading component for lesson content
 */
function LessonContentSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Lesson navigation component for draft
 */
function DraftLessonNavigation({ 
  courseId, 
  currentLessonIndex, 
  lessons 
}: { 
  courseId: string
  currentLessonIndex: number
  lessons: typeof mockCourseDraft.draftLessons
}) {
  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
      {prevLesson && (
        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
          <Link href={`/drafts/courses/${courseId}/lessons/${prevLesson.id}/preview`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Link>
        </Button>
      )}
      
      <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
        <Link href={`/drafts/courses/${courseId}`}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Back to Course Draft
        </Link>
      </Button>
      
      {nextLesson && (
        <Button size="sm" className="w-full sm:w-auto" asChild>
          <Link href={`/drafts/courses/${courseId}/lessons/${nextLesson.id}/preview`}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  )
}

/**
 * Lesson metadata component for draft
 */
function DraftLessonMetadata({ 
  lessonData,
  courseDraft
}: { 
  lessonData: typeof mockLessonDraft
  courseDraft: typeof mockCourseDraft
}) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const readingTime = lessonData.type !== 'video' && lessonData.content ? getReadingTime(lessonData.content) : null

  return (
    <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground">
      <div className="flex items-center space-x-1">
        <User className="h-4 w-4" />
        <span>{lessonData.author}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Calendar className="h-4 w-4" />
        <span>Lesson {lessonData.index + 1}</span>
      </div>
      
      {readingTime && (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      )}
      
      {lessonData.type === 'video' && (
        <div className="flex items-center space-x-1">
          <PlayCircle className="h-4 w-4" />
          <span>{lessonData.duration}</span>
        </div>
      )}

      <DraftPreviewBadge />
    </div>
  )
}

/**
 * Lesson content component for draft preview
 */
function DraftLessonContent({ 
  courseId, 
  lessonId 
}: { 
  courseId: string
  lessonId: string 
}) {
  // In a real implementation, fetch draft data from API
  const [lessonData, setLessonData] = useState(mockLessonDraft)
  const [courseDraft, setCourseDraft] = useState(mockCourseDraft)
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <LessonContentSkeleton />
  }
  
  if (!lessonData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Lesson draft not found</p>
      </div>
    )
  }

  const currentLessonIndex = courseDraft.draftLessons.findIndex(l => l.id === lessonId)
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'guide':
        return <BookOpen className="h-4 w-4" />
      case 'tutorial':
        return <PlayCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Draft Preview Banner */}
      <DraftBanner
        title="Lesson Draft Preview"
        description="This is exactly how your lesson will appear when the course is published."
        actions={
          <DraftActions
            editHref={`/drafts/courses/${courseId}/lessons/${lessonId}/edit`}
            publishHref={`/drafts/courses/${courseId}/publish`}
          />
        }
      />

      {/* Course Context & Lesson Header */}
      <div className="space-y-4">
        {/* Course Context - Compact */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{courseDraft.title}</h3>
              <div className="text-sm text-muted-foreground">
                Course Draft Preview
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {courseDraft.category}
            </Badge>
            <DraftBadge variant="outline" />
          </div>
        </div>

        {/* Lesson Title & Badges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getContentTypeIcon(lessonData.type)}
              <h1 className="text-2xl sm:text-3xl font-bold">{lessonData.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {lessonData.type}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {lessonData.difficulty}
              </Badge>
              {lessonData.isPremium && (
                <Badge variant="warning-outline">
                  Premium
                </Badge>
              )}
              <DraftBadge variant="outline" />
            </div>
          </div>
          
          <DraftLessonMetadata 
            lessonData={lessonData}
            courseDraft={courseDraft}
          />
        </div>
      </div>

      {/* Navigation & Progress - Compact */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <DraftLessonNavigation 
                courseId={courseId} 
                currentLessonIndex={currentLessonIndex} 
                lessons={courseDraft.draftLessons}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {courseDraft.draftLessons.length}
              </div>
              <div className="w-32">
                <Progress value={((currentLessonIndex + 1) / courseDraft.draftLessons.length) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {lessonData.type === 'video' ? (
            <VideoPlayer
              content={lessonData.content}
              title={lessonData.title}
              duration={lessonData.duration}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <MarkdownRenderer content={lessonData.content} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Lesson Sidebar */}
        <div className="space-y-4">
          {/* Course Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Course Lessons (Draft)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {courseDraft.draftLessons.map((l, index) => (
                  <div
                    key={l.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer ${
                      l.id === lessonId 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        l.id === lessonId 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/drafts/courses/${courseId}/lessons/${l.id}/preview`}
                        className={`block text-sm truncate ${
                          l.id === lessonId 
                            ? 'font-semibold' 
                            : 'hover:underline'
                        }`}
                      >
                        {l.title || `Lesson ${l.index + 1}`}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {l.isPremium ? 'Premium' : 'Free'} • Draft
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Draft Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Draft Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/drafts/courses/${courseId}/lessons/${lessonId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lesson
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/drafts/courses/${courseId}/edit`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Edit Course
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/drafts/courses/${courseId}/publish`}>
                  <Share className="h-4 w-4 mr-2" />
                  Publish Course
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Lesson draft preview page client component
 */
export function LessonDraftPreviewPageClient({ courseId, lessonId }: LessonDraftPreviewPageClientProps) {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  
  // Show loading state while session is loading
  if (sessionStatus === 'loading') {
    return (
      <MainLayout>
        <Section spacing="lg">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-4"></div>
          </div>
        </Section>
      </MainLayout>
    )
  }
  
  // If not authenticated, redirect to sign in
  if (sessionStatus === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }
  
  return (
    <MainLayout>
      <Section spacing="lg">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/drafts" className="hover:text-foreground cursor-pointer">
              Drafts
            </Link>
            <span>•</span>
            <Link href={`/drafts/courses/${courseId}`} className="hover:text-foreground cursor-pointer">
              Course Draft
            </Link>
            <span>•</span>
            <span>Lesson Preview</span>
          </div>

          {/* Content */}
          <Suspense fallback={<LessonContentSkeleton />}>
            <DraftLessonContent courseId={courseId} lessonId={lessonId} />
          </Suspense>
        </div>
      </Section>
    </MainLayout>
  )
}