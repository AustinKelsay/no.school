"use client";

import { useDocumentsQuery, DocumentResourceWithNote } from "@/hooks/useDocumentsQuery";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ContentCard } from "@/components/ui/content-card";
import { Section } from "@/components/layout";
import { useHomepageSectionConfig } from "@/hooks/useContentConfig";
import { applyContentFilters } from "@/lib/content-config";

/**
 * Client component for fetching and displaying document resources
 * Uses the useDocumentsQuery hook to fetch document resources with their Nostr notes
 */
export function DocumentsSection() {
  const { documents, isLoading, isError, error } = useDocumentsQuery();
  const sectionConfig = useHomepageSectionConfig('documents');
  
  // If section is disabled in config, don't render
  if (!sectionConfig?.enabled) {
    return null;
  }
  
  // Apply filters from configuration
  const filteredDocuments = sectionConfig ? applyContentFilters(documents, sectionConfig.filters) : documents;

  if (isLoading) {
    return (
      <Section spacing="lg" className="bg-muted/30">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{sectionConfig?.title || 'Documents'}</h2>
            <p className="text-muted-foreground">
              {sectionConfig?.description || 'Guides, tutorials, and educational materials for Bitcoin development'}
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading documents...</span>
          </div>
        </div>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section spacing="lg" className="bg-muted/30">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{sectionConfig?.title || 'Documents'}</h2>
            <p className="text-muted-foreground">
              {sectionConfig?.description || 'Guides, tutorials, and educational materials for Bitcoin development'}
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-600">Error loading documents: {error?.message}</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="lg" className="bg-muted/30">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Documents</h2>
          <p className="text-muted-foreground">
            Guides, tutorials, and educational materials for Bitcoin development
          </p>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No document resources available at the moment.</p>
          </div>
        ) : (
          <Carousel 
            opts={{
              align: "start",
              loop: sectionConfig?.carousel.loop || false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredDocuments.map((document) => (
                <CarouselItem key={document.id} className={`pl-2 md:pl-4 ${sectionConfig?.carousel.itemsPerView.tablet === 2 ? 'md:basis-1/2' : ''} ${sectionConfig?.carousel.itemsPerView.desktop === 3 ? 'lg:basis-1/3' : sectionConfig?.carousel.itemsPerView.desktop === 4 ? 'lg:basis-1/4' : 'lg:basis-1/2'}`}>
                  <DocumentCard document={document} />
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
 * Custom document card component that handles the DocumentResourceWithNote type
 * Transforms Document resource data into a format compatible with ContentCard
 */
function DocumentCard({ document }: { document: DocumentResourceWithNote }) {
  
  // Transform DocumentResourceWithNote into ContentCard-compatible format
  const contentItem = {
    id: document.id,
    type: 'document' as const,
    title: document.note?.tags.find(tag => tag[0] === "title")?.[1] || 
           document.note?.tags.find(tag => tag[0] === "name")?.[1] || 
           `Document ${document.id}`,
    description: document.note?.tags.find(tag => tag[0] === "summary")?.[1] || 
                document.note?.tags.find(tag => tag[0] === "description")?.[1] || 
                document.note?.tags.find(tag => tag[0] === "about")?.[1] || '',
    category: document.price > 0 ? 'Premium' : 'Free',
    duration: '5-10 min read',
    image: document.note?.tags.find(tag => tag[0] === "image")?.[1] || '',
    href: `/content/${document.id}`,
    tags: document.note?.tags || [],
    author: document.userId,
    instructor: document.userId,
    instructorPubkey: document.note?.pubkey || '',
    published: true,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    price: document.price,
    isPremium: document.price > 0,
    isNew: false,
    rating: 4.5,
    studentsCount: 0,
    featured: false,
    topics: document.note?.tags.filter(tag => tag[0] === "t").map(tag => tag[1]) || [],
    additionalLinks: document.note?.tags.filter(tag => tag[0] === "r").map(tag => tag[1]) || [],
  };

  return <ContentCard item={contentItem} variant="content" showContentTypeTags={false} />;
} 