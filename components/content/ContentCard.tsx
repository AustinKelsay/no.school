/**
 * @fileoverview Content card component for displaying courses, videos, and documents
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ContentCardProps } from '@/types';

/**
 * Displays a content card with title, metadata, and interaction buttons
 * Supports different content types and Bitcoin Lightning payments
 *
 * @component
 * @param {ContentCardProps} props - Component props
 * @returns {JSX.Element} Rendered content card
 */
export function ContentCard({
  type,
  title,
  summary,
  image,
  price = 0,
  topics,
  author,
  createdAt,
  progress,
  isPurchased = false,
  onClick,
  onPurchase,
  onZap,
  showActions = true,
  className = '',
  ...props
}: ContentCardProps) {
  const handleCardClick = () => {
    onClick?.();
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPurchase?.();
  };

  const handleZapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onZap?.(1000); // Default 1000 sats
  };

  const formatPrice = (amount: number): string => {
    if (amount === 0) return 'Free';
    return `${amount.toLocaleString()} sats`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (contentType: string): string => {
    switch (contentType) {
      case 'course':
        return '📚';
      case 'video':
        return '🎥';
      case 'document':
        return '📄';
      default:
        return '📖';
    }
  };

  const getTypeColor = (contentType: string): string => {
    switch (contentType) {
      case 'course':
        return 'bg-bitcoin-orange/10 text-bitcoin-orange border-bitcoin-orange/20';
      case 'video':
        return 'bg-lightning-purple/10 text-lightning-purple border-lightning-purple/20';
      case 'document':
        return 'bg-nostr-purple/10 text-nostr-purple border-nostr-purple/20';
      default:
        return 'bg-zinc-700/10 text-zinc-400 border-zinc-700/20';
    }
  };

  return (
    <Card
      className={`cursor-pointer border-zinc-800 bg-zinc-900 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 ${className}`}
      onClick={handleCardClick}
      {...props}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className={getTypeColor(type)}>
                {getTypeIcon(type)} {type}
              </Badge>
              {isPurchased && (
                <Badge
                  variant="secondary"
                  className="border-success/20 bg-success/10 text-success"
                >
                  Owned
                </Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2 text-lg font-semibold text-zinc-100">
              {title}
            </CardTitle>
          </div>
        </div>

        {/* Author and date */}
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                <Image
                  src={author.avatar}
                  alt={author.username || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700">
                <span className="text-xs">
                  {author.username?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <span>{author.username || 'Anonymous'}</span>
          </div>
          <span>{formatDate(createdAt)}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary */}
        <p className="mb-4 line-clamp-3 text-sm text-zinc-300">{summary}</p>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                {topic}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-zinc-800 text-xs text-zinc-300"
              >
                +{topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Progress bar */}
        {typeof progress === 'number' && progress > 0 && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-400">Progress</span>
              <span className="text-zinc-300">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full bg-bitcoin-orange transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isPurchased && price > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePurchaseClick}
                  className="btn-bitcoin"
                >
                  {formatPrice(price)}
                </Button>
              )}
              {price === 0 && (
                <Badge
                  variant="secondary"
                  className="border-success/20 bg-success/10 text-success"
                >
                  Free
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onZap && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZapClick}
                  className="border-lightning-purple/30 text-lightning-purple hover:bg-lightning-purple/10"
                >
                  ⚡ Zap
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
