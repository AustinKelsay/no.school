"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
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
  enabled?: boolean; // Allow manual control
  elementRef?: React.RefObject<HTMLElement>; // For visibility tracking
  currentUserPubkey?: string; // Optional override for identifying viewer reactions
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
  hasReacted: boolean;
  userReactionEventId: string | null;
}

export function useInteractions(options: UseInteractionsOptions): InteractionsQueryResult {
  const { eventId, elementRef, enabled: manualEnabled = true, currentUserPubkey: explicitPubkey } = options;
  const { subscribe } = useSnstrContext();
  const { data: session } = useSession();
  const normalizedSessionPubkey = session?.user?.pubkey?.toLowerCase();
  const currentUserPubkey = (explicitPubkey?.toLowerCase() || normalizedSessionPubkey) ?? null;
  
  const [isVisible, setIsVisible] = useState(true);
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
  const [userReactionEventId, setUserReactionEventId] = useState<string | null>(null);

  // Use refs to persist arrays across effect re-runs
  const zapsRef = useRef<NostrEvent[]>([]);
  const likesRef = useRef<NostrEvent[]>([]);
  const commentsRef = useRef<NostrEvent[]>([]);
  const seenZapsRef = useRef<Set<string>>(new Set());
  const seenLikesRef = useRef<Set<string>>(new Set());
  const seenCommentsRef = useRef<Set<string>>(new Set());
  const subscriptionRef = useRef<{ close: () => void } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetInteractionStorage = () => {
    zapsRef.current = [];
    likesRef.current = [];
    commentsRef.current = [];
    seenZapsRef.current = new Set();
    seenLikesRef.current = new Set();
    seenCommentsRef.current = new Set();
    setUserReactionEventId(null);
  };

  useEffect(() => {
    if (!currentUserPubkey) {
      setUserReactionEventId(null);
      return;
    }

    const existingReaction = likesRef.current.find(
      (event) => event.pubkey?.toLowerCase() === currentUserPubkey
    );

    setUserReactionEventId(existingReaction ? existingReaction.id : null);
  }, [currentUserPubkey]);

  // Set up intersection observer for visibility-based subscription management
  useEffect(() => {
    if (!elementRef?.current) {
      setIsVisible(true); // Default to visible if no ref provided
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px' // Start loading 50px before element is visible
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  // Main subscription effect
  useEffect(() => {
    // Only subscribe if enabled, visible, and has valid eventId
    const shouldSubscribe = manualEnabled && isVisible && eventId && eventId.length === 64;
    
    if (!shouldSubscribe) {
      // Clean up existing subscription if conditions change
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!eventId || eventId.length !== 64) {
        resetInteractionStorage();
        setInteractions({ zaps: 0, likes: 0, comments: 0, replies: 0, threadComments: 0 });
        setIsLoading(false);
        setIsLoadingZaps(false);
        setIsLoadingLikes(false);
        setIsLoadingComments(false);
      }
      return;
    }

    // If we already have a subscription, don't create a new one
    if (subscriptionRef.current) {
      return;
    }

    resetInteractionStorage();
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

    const setupSubscription = async () => {
      try {
        // Subscribe to all interaction types with a single subscription
        const subscription = await subscribe(
          [{ kinds: [9735, 7, 1], '#e': [eventId] }],
          (event: NostrEvent) => {
            // Route events to appropriate arrays based on kind
            const eventIdKey = event.id;
            switch (event.kind) {
              case 9735: // Zaps
                if (!seenZapsRef.current.has(eventIdKey)) {
                  seenZapsRef.current.add(eventIdKey);
                  zapsRef.current.push(event);
                  setIsLoadingZaps(false);
                  updateCounts();
                }
                break;
              case 7: // Likes/Reactions
                // Accept all kind 7 reactions as likes (they are reactions/likes by definition)
                // Common formats: '+', '', '❤️', ':heart:', ':shakingeyes:', etc.
                if (!seenLikesRef.current.has(eventIdKey)) {
                  seenLikesRef.current.add(eventIdKey);
                  likesRef.current.push(event);
                  setIsLoadingLikes(false);
                  if (currentUserPubkey && event.pubkey?.toLowerCase() === currentUserPubkey) {
                    setUserReactionEventId(eventIdKey);
                  }
                  updateCounts();
                }
                break;
              case 1: // Comments
                if (!seenCommentsRef.current.has(eventIdKey)) {
                  seenCommentsRef.current.add(eventIdKey);
                  commentsRef.current.push(event);
                  setIsLoadingComments(false);
                  updateCounts();
                }
                break;
            }
          }
        );

        subscriptionRef.current = subscription;

        // Give subscription time to receive initial data
        setTimeout(() => {
          setIsLoadingZaps(false);
          setIsLoadingLikes(false);
          setIsLoadingComments(false);
          setIsLoading(false);
        }, 5000); // Wait 5 seconds for initial data

        // Dynamic timeout based on visibility
        // If not visible for 30 seconds, close the subscription
        if (!isVisible) {
          timeoutRef.current = setTimeout(() => {
            if (subscriptionRef.current && !isVisible) {
              subscriptionRef.current.close();
              subscriptionRef.current = null;
            }
          }, 30000);
        }

      } catch (err) {
        console.error('Error setting up subscription:', err);
        setIsError(true);
        setError(err as Error);
        setIsLoading(false);
        setIsLoadingZaps(false);
        setIsLoadingLikes(false);
        setIsLoadingComments(false);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [eventId, subscribe, manualEnabled, isVisible, currentUserPubkey]);

  const getDirectReplies = () => {
    return interactions.replies;
  };

  const getThreadComments = () => {
    return interactions.threadComments;
  };

  const refetch = () => {
    // Close existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.close();
      subscriptionRef.current = null;
    }
    
    // Reset data
    resetInteractionStorage();
    setInteractions({ zaps: 0, likes: 0, comments: 0, replies: 0, threadComments: 0 });

    // Force re-run of the effect
    setIsLoading(true);
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
    refetch,
    hasReacted: Boolean(userReactionEventId),
    userReactionEventId
  };
}
