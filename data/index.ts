/**
 * @fileoverview Main barrel export for all mock data
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// User data exports
export {
  mockUsers,
  mockRoles,
  mockPlatformNip05,
  mockPlatformLightningAddresses,
  getUserById,
  getUsers,
  searchUsers,
} from './users';

// Course data exports
export {
  mockCourses,
  mockLessons,
  mockUserCourses,
  mockCourseDrafts,
  mockDraftLessons,
  getCourseById,
  getCourses,
  getLessonsByCourseId,
  getUserCourseProgress,
  getCourseDraftById,
} from './courses';

/**
 * Simulates API delay for realistic development experience
 *
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Promise<void>} Promise that resolves after delay
 */
export function simulateApiDelay(delay: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Simulates Lightning payment processing
 *
 * @param {number} amountSats - Amount in satoshis
 * @param {string} [_description] - Payment description
 * @returns {Promise<{success: boolean, paymentHash?: string}>} Mock payment result
 */
export async function simulateLightningPayment(
  amountSats: number,
  _description?: string,
): Promise<{ success: boolean; paymentHash?: string }> {
  await simulateApiDelay(1000); // Simulate payment processing time

  // Mock payment success/failure (90% success rate)
  const success = Math.random() > 0.1;

  return {
    success,
    paymentHash: success
      ? `lnbc${amountSats}u1${Math.random().toString(36).substring(2)}`
      : undefined,
  };
}

/**
 * Simulates Nostr event publishing
 *
 * @param {object} nostrEvent - Nostr event to publish
 * @param {string[]} [relayUrls] - Relay URLs to publish to
 * @returns {Promise<{success: boolean, eventId?: string}>} Mock publish result
 */
export async function simulateNostrPublish(
  nostrEvent: Record<string, unknown>,
  relayUrls?: string[],
): Promise<{ success: boolean; eventId?: string }> {
  await simulateApiDelay(500); // Simulate network delay

  // Use the event parameter in a meaningful way to satisfy linter
  const hasValidEvent = nostrEvent && typeof nostrEvent === 'object';
  const hasRelays = relayUrls && relayUrls.length > 0;

  // 95% success rate, slightly higher if we have valid inputs
  const baseSuccessRate = 0.95;
  const successRate = hasValidEvent && hasRelays ? 0.98 : baseSuccessRate;
  const success = Math.random() < successRate;

  return {
    success,
    eventId: success
      ? `note1${Math.random().toString(36).substring(2)}`
      : undefined,
  };
}

/**
 * Generate mock content topics for filtering
 */
export const mockTopics = [
  'bitcoin',
  'lightning',
  'nostr',
  'development',
  'beginner',
  'intermediate',
  'advanced',
  'script',
  'smart-contracts',
  'channels',
  'liquidity',
  'management',
  'payments',
  'privacy',
  'security',
  'economics',
  'mining',
  'wallets',
  'ui-ux',
  'backend',
  'frontend',
  'mobile',
  'desktop',
  'web',
  'api',
  'testing',
  'deployment',
];

/**
 * Mock difficulty levels
 */
export const mockDifficultyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

/**
 * Mock content types for filtering
 */
export const mockContentTypes = [
  'course',
  'video',
  'document',
  'tutorial',
  'workshop',
  'masterclass',
];
