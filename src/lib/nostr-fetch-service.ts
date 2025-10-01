/**
 * Service for fetching Nostr events from relays
 * Used by db-adapter to get content for courses and resources
 */

import { NostrEvent, type RelayPool } from 'snstr'
import { DEFAULT_RELAYS, getRelays } from './nostr-relays'

export class NostrFetchService {
  /**
   * Fetch a single event by ID from relays
   */
  static async fetchEventById(
    eventId: string, 
    relayPool?: RelayPool,
    relays: string[] = DEFAULT_RELAYS
  ): Promise<NostrEvent | null> {
    try {
      // If no relay pool provided, create a temporary one
      if (!relayPool) {
        // Use dynamic import to avoid server-side issues
        const { RelayPool: RP } = await import('snstr')
        const tempPool = new RP(relays)
        
        try {
          const event = await this.fetchWithPool(tempPool, eventId)
          tempPool.close()
          return event
        } catch (error) {
          tempPool.close()
          throw error
        }
      }
      
      // Use provided relay pool
      return await this.fetchWithPool(relayPool, eventId)
    } catch (error) {
      console.error('Error fetching Nostr event:', error)
      return null
    }
  }

  /**
   * Fetch multiple events by IDs
   */
  static async fetchEventsByIds(
    eventIds: string[], 
    relayPool?: RelayPool,
    relays: string[] = DEFAULT_RELAYS
  ): Promise<Map<string, NostrEvent>> {
    const events = new Map<string, NostrEvent>()
    
    try {
      // If no relay pool provided, create a temporary one
      if (!relayPool) {
        const { RelayPool: RP } = await import('snstr')
        const tempPool = new RP(relays)
        
        try {
          const fetchedEvents = await this.fetchMultipleWithPool(tempPool, eventIds)
          tempPool.close()
          return fetchedEvents
        } catch (error) {
          tempPool.close()
          throw error
        }
      }
      
      // Use provided relay pool
      return await this.fetchMultipleWithPool(relayPool, eventIds)
    } catch (error) {
      console.error('Error fetching Nostr events:', error)
      return events
    }
  }

  /**
   * Fetch events by d-tag values (for addressable events)
   */
  static async fetchEventsByDTags(
    dTags: string[],
    kinds: number[],
    pubkey?: string,
    relayPool?: RelayPool,
    relays: string[] = DEFAULT_RELAYS
  ): Promise<Map<string, NostrEvent>> {
    const events = new Map<string, NostrEvent>()
    
    try {
      if (!relayPool) {
        const { RelayPool: RP } = await import('snstr')
        const tempPool = new RP(relays)
        
        try {
          const filter: any = {
            kinds,
            '#d': dTags
          }
          if (pubkey) {
            filter.authors = [pubkey]
          }
          
          await new Promise<void>((resolve) => {
            let sub: { close: () => void }
            
            const timeout = setTimeout(async () => {
              if (sub) sub.close()
              resolve()
            }, 5000) // 5 second timeout
            
            tempPool.subscribe(
              relays,
              [filter],
              (event: NostrEvent) => {
                const dTag = event.tags.find(tag => tag[0] === 'd')?.[1]
                if (dTag) {
                  events.set(dTag, event)
                }
              },
              () => {
                clearTimeout(timeout)
                if (sub) sub.close()
                resolve()
              }
            ).then(subscription => {
              sub = subscription
            })
          })
          
          tempPool.close()
          return events
        } catch (error) {
          tempPool.close()
          throw error
        }
      }
      
      // Use provided relay pool
      const filter: any = {
        kinds,
        '#d': dTags
      }
      if (pubkey) {
        filter.authors = [pubkey]
      }
      
      await new Promise<void>((resolve) => {
        let sub: { close: () => void }
        
        const timeout = setTimeout(async () => {
          if (sub) sub.close()
          resolve()
        }, 5000)
        
        relayPool.subscribe(
          relays,
          [filter],
          (event: NostrEvent) => {
            const dTag = event.tags.find(tag => tag[0] === 'd')?.[1]
            if (dTag) {
              events.set(dTag, event)
            }
          },
          () => {
            clearTimeout(timeout)
            if (sub) sub.close()
            resolve()
          }
        ).then(subscription => {
          sub = subscription
        })
      })
      
      return events
    } catch (error) {
      console.error('Error fetching events by d-tags:', error)
      return events
    }
  }

  // Private helper methods
  private static async fetchWithPool(pool: RelayPool, eventId: string): Promise<NostrEvent | null> {
    return new Promise((resolve) => {
      let foundEvent: NostrEvent | null = null
      let sub: { close: () => void }
      
      const timeout = setTimeout(() => {
        if (sub) sub.close()
        resolve(foundEvent)
      }, 5000) // 5 second timeout
      
      pool.subscribe(
        relays && relays.length ? relays : getRelays('default'),
        [{ ids: [eventId] }],
        (event: NostrEvent) => {
          foundEvent = event
          clearTimeout(timeout)
          if (sub) sub.close()
          resolve(event)
        },
        () => {
          clearTimeout(timeout)
          if (sub) sub.close()
          resolve(foundEvent)
        }
      ).then(subscription => {
        sub = subscription
      })
    })
  }

  private static async fetchMultipleWithPool(
    pool: RelayPool, 
    eventIds: string[]
  ): Promise<Map<string, NostrEvent>> {
    const events = new Map<string, NostrEvent>()
    
    return new Promise((resolve) => {
      let sub: { close: () => void }
      
      const timeout = setTimeout(() => {
        if (sub) sub.close()
        resolve(events)
      }, 5000) // 5 second timeout
      
      pool.subscribe(
        relays && relays.length ? relays : getRelays('default'),
        [{ ids: eventIds }],
        (event: NostrEvent) => {
          events.set(event.id, event)
        },
        () => {
          clearTimeout(timeout)
          if (sub) sub.close()
          resolve(events)
        }
      ).then(subscription => {
        sub = subscription
      })
    })
  }
}
