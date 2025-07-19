"use client";

import { useState, useEffect, useRef } from 'react';
import { useSnstrContext } from '../contexts/snstr-context';
import { NostrEvent } from 'snstr';

export interface InteractionCounts {
  zaps: number;
  likes: number;
  comments: number;
  replies: number; // Direct replies only
  threadComments: number; // All thread-related comments
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
  // Additional methods for thread analysis
  getDirectReplies: () => number;
  getThreadComments: () => number;
  refetch?: () => void;
}

export function useInteractions(options: UseInteractionsOptions): InteractionsQueryResult {
  const { eventId } = options;
  const { subscribe } = useSnstrContext();
  
  const [interactions, setInteractions] = useState<InteractionCounts>({ 
    zaps: 0, 
    likes: 0, 
    comments: 0, 
    replies: 0, 
    threadComments: 0 
  });
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
      setInteractions({ zaps: 0, likes: 0, comments: 0, replies: 0, threadComments: 0 });
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
      // For now, set replies and threadComments to be the same as comments
      // TODO: Implement proper NIP-10 thread parsing to differentiate
      const commentsCount = commentsRef.current.length;
      setInteractions({
        zaps: zapsRef.current.length,
        likes: likesRef.current.length,
        comments: commentsCount,
        replies: commentsCount, // For now, treating all comments as replies
        threadComments: commentsCount // For now, treating all comments as thread comments
      });
    };

    const setupSubscriptions = async () => {
      try {
        // Subscribe to all interaction types with a single subscription
        const interactionSubscription = await subscribe(
          [{ kinds: [9735, 7, 1], '#e': [eventId] }],
          (event: NostrEvent) => {
            console.log(`interaction event (kind ${event.kind})`, event);
            
            // Route events to appropriate arrays based on kind
            switch (event.kind) {
              case 9735: // Zaps
                zapsRef.current.push(event);
                setIsLoadingZaps(false);
                break;
              case 7: // Likes/Reactions
                // Accept all kind 7 reactions as likes (they are reactions/likes by definition)
                // Common formats: '+', '', '❤️', ':heart:', ':shakingeyes:', etc.
                likesRef.current.push(event);
                setIsLoadingLikes(false);
                break;
              case 1: // Comments
                commentsRef.current.push(event);
                setIsLoadingComments(false);
                break;
            }
            
            updateCounts();
          }
        );

        // Give subscription time to receive initial data
        setTimeout(() => {
          setIsLoadingZaps(false);
          setIsLoadingLikes(false);
          setIsLoadingComments(false);
          setIsLoading(false);
        }, 5000); // Wait 5 seconds for initial data

        // Close subscription after 20 seconds
        const cleanup = setTimeout(() => {
          interactionSubscription.close();
        }, 20000);

        // Return cleanup function
        return () => {
          clearTimeout(cleanup);
          interactionSubscription.close();
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

  const getDirectReplies = () => {
    return interactions.replies;
  };

  const getThreadComments = () => {
    return interactions.threadComments;
  };

  return {
    interactions,
    isLoading,
    isError,
    error,
    // Individual loading states for each interaction type
    isLoadingZaps,
    isLoadingLikes,
    isLoadingComments,
    // Additional methods for thread analysis
    getDirectReplies,
    getThreadComments,
    refetch: () => {
      // Force re-run of the effect by updating state
      setIsLoading(true);
    }
  };
}