"use client";

import { useVideosQuery, VideoResourceWithNote } from "@/hooks/useVideosQuery";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ContentCard } from "@/components/ui/content-card";
import { Section } from "@/components/layout";

/**
 * Client component for fetching and displaying video resources
 * Uses the useVideosQuery hook to fetch video resources with their Nostr notes
 */
export function VideosSection() {
  const { videos, isLoading, isError, error } = useVideosQuery();

  if (isLoading) {
    return (
      <Section spacing="lg" className="bg-background">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Videos</h2>
            <p className="text-muted-foreground">
              Video tutorials and workshops from Bitcoin developers and experts
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading videos...</span>
          </div>
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section spacing="lg" className="bg-background">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Videos</h2>
            <p className="text-muted-foreground">
              Video tutorials and workshops from Bitcoin developers and experts
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-600">Error loading videos: {error?.message}</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="lg" className="bg-background">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Videos</h2>
          <p className="text-muted-foreground">
            Video tutorials and workshops from Bitcoin developers and experts
          </p>
        </div>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No video resources available at the moment.</p>
          </div>
        ) : (
          <Carousel 
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videos.map((video) => (
                <CarouselItem key={video.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <VideoCard video={video} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </Carousel>
        )}
      </div>
    </Section>
  );
}

/**
 * Custom video card component that handles the VideoResourceWithNote type
 * Transforms Video resource data into a format compatible with ContentCard
 */
function VideoCard({ video }: { video: VideoResourceWithNote }) {
  
  // Transform VideoResourceWithNote into ContentCard-compatible format
  const contentItem = {
    id: video.id,
    type: 'video' as const,
    title: video.note?.tags.find(tag => tag[0] === "title")?.[1] || 
           video.note?.tags.find(tag => tag[0] === "name")?.[1] || 
           `Video ${video.id}`,
    description: video.note?.tags.find(tag => tag[0] === "summary")?.[1] || 
                video.note?.tags.find(tag => tag[0] === "description")?.[1] || 
                video.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
    category: video.price > 0 ? 'Premium' : 'Free',
    duration: '15-30 min',
    difficulty: 'beginner' as const,
    image: video.note?.tags.find(tag => tag[0] === "image")?.[1] || '',
    href: `/content/${video.id}`,
    tags: video.note?.tags || [],
    author: video.userId,
    instructor: video.userId,
    instructorPubkey: video.note?.pubkey || '',
    published: true,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
    price: video.price,
    isPremium: video.price > 0,
    isNew: false,
    rating: 4.5,
    studentsCount: 0,
    featured: false,
    topics: video.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
    additionalLinks: video.note?.tags.filter(tag => tag[0] === "r").map(tag => tag[1]) || [],
  };

  return <ContentCard item={contentItem} variant="content" />;
} 