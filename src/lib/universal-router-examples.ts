/**
 * Universal Router Examples
 * 
 * This file demonstrates how the universal routing system works with different ID formats.
 * You can use these examples to test and understand the functionality.
 */

import { resolveUniversalId, getUniversalRoute, useUniversalRouter } from './universal-router'

// Example usage of the universal router

// 1. Database IDs (existing format)
const databaseIdExample = () => {
  const courseId = 'course-1'
  const resourceId = 'resource-1'
  const lessonId = 'lesson-1'
  
  console.log('Database ID routing:')
  console.log('Course:', resolveUniversalId(courseId))
  console.log('Resource:', resolveUniversalId(resourceId))
  console.log('Lesson:', resolveUniversalId(lessonId))
  console.log('Course route:', getUniversalRoute(courseId))
  console.log('Resource route:', getUniversalRoute(resourceId))
}

// 2. Hex IDs (64-character hex strings)
const hexIdExample = () => {
  const hexId = 'd2797459e3f15491b39225a68146d3ec375f71d01b57cfe3a559179777e20912'
  
  console.log('Hex ID routing:')
  console.log('Result:', resolveUniversalId(hexId))
  console.log('Route:', getUniversalRoute(hexId))
}

// 3. NIP-19 encoded entities
const nip19Examples = () => {
  // These are example NIP-19 entities - in real usage, these would be valid encoded entities
  
  // npub (public key)
  const npubExample = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6'
  
  // note (note ID)  
  const noteExample = 'note1qqzkjurnw4ksz9thwden5te0wfjkccte9ehx7um5wghx7un8qgs2d90kkcq3nk2jry62dyf50k0h36rhpdtd594my40w9pkal876jxgrqsqqqa28pccpzu'
  
  // nevent (event with metadata)
  const neventExample = 'nevent1qqst8cujky046negxgwwm5ynqwn53t8aqjr6afd8g59nfqwxpdhylpcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mg8arnc9'
  
  // naddr (addressable event)
  const naddrExample = 'naddr1qqzkjurnw4ksz9thwden5te0wfjkccte9ehx7um5wghx7un8qgs2d90kkcq3nk2jry62dyf50k0h36rhpdtd594my40w9pkal876jxgrqsqqqa28pccpzu'
  
  console.log('NIP-19 routing examples:')
  
  try {
    console.log('npub:', resolveUniversalId(npubExample))
    console.log('note:', resolveUniversalId(noteExample))
    console.log('nevent:', resolveUniversalId(neventExample))
    console.log('naddr:', resolveUniversalId(naddrExample))
  } catch (error) {
    console.log('Note: These are example IDs and may not decode properly without valid data')
  }
}

// 4. React hook usage example
const ReactComponentExample = ({ id }: { id: string }) => {
  const router = useUniversalRouter(id)
  
  console.log('Hook result:', router)
  
  // You can now use:
  // - router.resolvedId: The ID to use for data queries
  // - router.route: The route path to navigate to
  // - router.contentType: Whether it's a course, resource, or lesson
  // - router.isValidId: Whether the ID is valid
  // - router.canRoute: Whether we can determine the correct route
  
  return null // This is just an example
}

// 5. Real-world usage scenarios
export const usageScenarios = {
  // Scenario 1: User pastes a Nostr event link
  handleNostrLink: (nostrEventId: string) => {
    const result = resolveUniversalId(nostrEventId)
    
    if (result.contentType === 'course') {
      // Navigate to course page
      return `/courses/${result.resolvedId}`
    } else if (result.contentType === 'resource') {
      // Navigate to content page
      return `/content/${result.resolvedId}`
    } else {
      // Default to content page
      return `/content/${result.resolvedId}`
    }
  },
  
  // Scenario 2: Search results with mixed ID types
  handleSearchResult: (item: { id: string; type?: string }) => {
    const result = resolveUniversalId(item.id)
    
    // Use the detected content type or fallback to provided type
    const contentType = result.contentType !== 'unknown' ? result.contentType : item.type
    
    return {
      id: result.resolvedId,
      originalId: result.originalId,
      route: getUniversalRoute(item.id),
      type: contentType
    }
  },
  
  // Scenario 3: URL parameter handling
  handleDynamicRoute: (params: { id: string }) => {
    const result = resolveUniversalId(params.id)
    
    // Return data needed for the page component
    return {
      resolvedId: result.resolvedId,
      shouldFetchFromNostr: ['nevent', 'naddr', 'note', 'hex'].includes(result.idType),
      shouldFetchFromDatabase: result.idType === 'database',
      queryStrategy: getQueryStrategy(result)
    }
  }
}

// Helper function to determine the best query strategy
function getQueryStrategy(result: ReturnType<typeof resolveUniversalId>) {
  switch (result.idType) {
    case 'nevent':
      return 'fetch_by_event_id'
    case 'naddr':
      return 'fetch_by_addressable_identifier'
    case 'note':
    case 'hex':
      return 'fetch_by_note_id'
    case 'database':
      return 'fetch_by_database_id'
    default:
      return 'fetch_by_identifier'
  }
}

// Export examples for testing
export {
  databaseIdExample,
  hexIdExample,
  nip19Examples,
  ReactComponentExample
}