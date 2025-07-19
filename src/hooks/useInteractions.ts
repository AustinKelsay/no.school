"use client";

import { useState, useEffect, useRef } from 'react';
import { useSnstrContext } from '../contexts/snstr-context';
import { NostrEvent } from 'snstr';

export interface InteractionCounts {
  zaps: number;
  likes: number;
  comments: number;
}

export interface UseInteractionsOptions {
  eventId?: string;
  realtime?: boolean;
  staleTime?: number;
}

export interface InteractionsQueryResult {
  interactions: InteractionCounts;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  // Individual loading states for each interaction type
  isLoadingZaps: boolean;
  isLoadingLikes: boolean;
  isLoadingComments: boolean;
}

export function useInteractions(options: UseInteractionsOptions): InteractionsQueryResult {
  const { eventId } = options;
  const { subscribe } = useSnstrContext();
  
  const [interactions, setInteractions] = useState<InteractionCounts>({ zaps: 0, likes: 0, comments: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Individual loading states for each interaction type
  const [isLoadingZaps, setIsLoadingZaps] = useState(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Use refs to persist arrays across effect re-runs
  const zapsRef = useRef<NostrEvent[]>([]);
  const likesRef = useRef<NostrEvent[]>([]);
  const commentsRef = useRef<NostrEvent[]>([]);

  useEffect(() => {
    // Don't subscribe if eventId is invalid
    if (!eventId || eventId.length !== 64) {
      setInteractions({ zaps: 0, likes: 0, comments: 0 });
      setIsLoading(false);
      setIsLoadingZaps(false);
      setIsLoadingLikes(false);
      setIsLoadingComments(false);
      return;
    }

    setIsLoading(true);
    setIsLoadingZaps(true);
    setIsLoadingLikes(true);
    setIsLoadingComments(true);
    setIsError(false);
    setError(null);

    // Reset arrays for new eventId
    zapsRef.current = [];
    likesRef.current = [];
    commentsRef.current = [];

    const updateCounts = () => {
      setInteractions({
        zaps: zapsRef.current.length,
        likes: likesRef.current.length,
        comments: commentsRef.current.length
      });
    };

    const setupSubscriptions = async () => {
      try {
        // Subscribe to zaps (kind 9735)
        const zapSubscription = await subscribe(
          [{ kinds: [9735], '#e': [eventId] }],
          (event: NostrEvent) => {
            console.log('zap event', event);
            zapsRef.current.push(event);
            updateCounts();
          }
        );

        // Subscribe to likes (kind 7) 
        const likesSubscription = await subscribe(
          [{ kinds: [7], '#e': [eventId] }],
          (event: NostrEvent) => {
            console.log('like event', event);
            // Accept all kind 7 reactions as likes (they are reactions/likes by definition)
            // Common formats: '+', '', '❤️', ':heart:', ':shakingeyes:', etc.
            likesRef.current.push(event);
            updateCounts();
          }
        );

        // Subscribe to comments (kind 1)
        const commentsSubscription = await subscribe(
          [{ kinds: [1], '#e': [eventId] }],
          (event: NostrEvent) => {
            console.log('comment event', event);
            commentsRef.current.push(event);
            updateCounts();
          }
        );

        // Give subscriptions time to receive initial data
        setTimeout(() => {
          setIsLoadingZaps(false);
          setIsLoadingLikes(false);
          setIsLoadingComments(false);
          setIsLoading(false);
        }, 5000); // Wait 5 seconds for initial data

        // Close subscriptions after 20 seconds
        const cleanup = setTimeout(() => {
          zapSubscription.close();
          likesSubscription.close();
          commentsSubscription.close();
        }, 20000);

        // Return cleanup function
        return () => {
          clearTimeout(cleanup);
          zapSubscription.close();
          likesSubscription.close();
          commentsSubscription.close();
        };
      } catch (err) {
        console.error('Error setting up subscriptions:', err);
        setIsError(true);
        setError(err as Error);
        setIsLoading(false);
        setIsLoadingZaps(false);
        setIsLoadingLikes(false);
        setIsLoadingComments(false);
      }
    };

    const cleanup = setupSubscriptions();

    // Return cleanup function
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [eventId, subscribe]);

  return {
    interactions,
    isLoading,
    isError,
    error,
    // Individual loading states for each interaction type
    isLoadingZaps,
    isLoadingLikes,
    isLoadingComments
  };
}