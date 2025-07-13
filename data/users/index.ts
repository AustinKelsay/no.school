/**
 * @fileoverview Mock users data matching production schema exactly
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type {
  User,
  Role,
  PlatformNip05,
  PlatformLightningAddress,
} from '@/types';

/**
 * Mock users with Nostr/Lightning integration
 * Matches production User model from Prisma schema
 */
export const mockUsers: User[] = [
  {
    id: 'user-1',
    pubkey:
      '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
    privkey: null, // Never expose in real app
    email: 'alice@example.com',
    emailVerified: new Date('2024-01-10'),
    username: 'alice_dev',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    nip05: 'alice@plebdevs.com',
    lud16: 'alice@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
  {
    id: 'user-2',
    pubkey:
      '03b3ec27c8b2a0c7e23b9a4f5c3d6e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    privkey: null,
    email: 'bob@example.com',
    emailVerified: new Date('2024-01-05'),
    username: 'bitcoinbob',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
    nip05: 'bob@plebdevs.com',
    lud16: 'bob@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
  {
    id: 'user-3',
    pubkey:
      '04c4e8b5d2f1a3e6c9b8a7d4f2e1c5b8a9d6e3f7c2b5a8d1e4f9c6b3a0d7e2f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5',
    privkey: null,
    email: 'charlie@example.com',
    emailVerified: new Date('2024-01-12'),
    username: 'lightning_charlie',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-20'),
    nip05: 'charlie@plebdevs.com',
    lud16: 'charlie@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
  {
    id: 'user-4',
    pubkey: null,
    privkey: null,
    email: 'diana@example.com',
    emailVerified: new Date('2024-01-18'),
    username: 'diana_learner',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22'),
    nip05: null,
    lud16: null,
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
  {
    id: 'user-5',
    pubkey:
      '05e7f9c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0',
    privkey: null,
    email: null,
    emailVerified: null,
    username: 'nostr_only_user',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    nip05: 'nostrninja@plebdevs.com',
    lud16: 'nostrninja@plebdevs.com',
    role: null,
    platformNip05: null,
    platformLightningAddress: null,
  },
];

/**
 * Mock user roles and subscriptions
 */
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    userId: 'user-1',
    subscribed: true,
    admin: false,
    subscriptionType: 'monthly',
    subscriptionStartDate: new Date('2024-01-01'),
    lastPaymentAt: new Date('2024-01-01'),
    subscriptionExpiredAt: new Date('2024-02-01'),
    nwc: 'nostr+walletconnect://69a08e6e64ac64937d3c...',
  },
  {
    id: 'role-2',
    userId: 'user-2',
    subscribed: false,
    admin: true,
    subscriptionType: 'yearly',
    subscriptionStartDate: new Date('2023-12-15'),
    lastPaymentAt: new Date('2023-12-15'),
    subscriptionExpiredAt: new Date('2024-12-15'),
    nwc: 'nostr+walletconnect://a7b3c8d9e4f2a6b1c5d8...',
  },
  {
    id: 'role-3',
    userId: 'user-3',
    subscribed: true,
    admin: false,
    subscriptionType: 'monthly',
    subscriptionStartDate: new Date('2024-01-08'),
    lastPaymentAt: new Date('2024-01-08'),
    subscriptionExpiredAt: new Date('2024-02-08'),
    nwc: null,
  },
];

/**
 * Mock platform NIP-05 identities
 */
export const mockPlatformNip05: PlatformNip05[] = [
  {
    id: 'nip05-1',
    userId: 'user-1',
    pubkey:
      '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
    name: 'alice',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'nip05-2',
    userId: 'user-2',
    pubkey:
      '03b3ec27c8b2a0c7e23b9a4f5c3d6e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    name: 'bob',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
  },
  {
    id: 'nip05-3',
    userId: 'user-5',
    pubkey:
      '05e7f9c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0f7c4b1a8d5e2f9c6b3a0d7e4f1c8b5a2d9e6f3c0b7a4d1e8f5c2b9a6d3e0',
    name: 'nostrninja',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

/**
 * Mock platform Lightning addresses
 */
export const mockPlatformLightningAddresses: PlatformLightningAddress[] = [
  {
    id: 'lnaddr-1',
    userId: 'user-1',
    name: 'alice',
    allowsNostr: true,
    description: 'Alice - Bitcoin Developer & Educator',
    maxSendable: BigInt(1000000), // 1M sats
    minSendable: BigInt(1000), // 1K sats
    invoiceMacaroon: 'AGIAJEemVQUTEyNCR0examplemacaroondata...',
    lndCert: null,
    lndHost: 'alice-node.example.com',
    lndPort: '10009',
  },
  {
    id: 'lnaddr-2',
    userId: 'user-2',
    name: 'bob',
    allowsNostr: true,
    description: 'Bob - Lightning Expert',
    maxSendable: BigInt(500000), // 500K sats
    minSendable: BigInt(1000), // 1K sats
    invoiceMacaroon: 'AGIAJEemVQUTEyNCR0examplemacaroondata2...',
    lndCert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...',
    lndHost: 'bob-node.example.com',
    lndPort: '10009',
  },
];

/**
 * Get user by ID with optional relationships
 */
export function getUserById(id: string, includeRelations = false) {
  const user = mockUsers.find(u => u.id === id);
  if (!user) return null;

  if (includeRelations) {
    return {
      ...user,
      role: mockRoles.find(r => r.userId === id) || null,
      platformNip05: mockPlatformNip05.find(n => n.userId === id) || null,
      platformLightningAddress:
        mockPlatformLightningAddresses.find(l => l.userId === id) || null,
    };
  }

  return user;
}

/**
 * Get users with pagination
 */
export function getUsers(page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const users = mockUsers.slice(start, end);

  return {
    items: users,
    totalCount: mockUsers.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockUsers.length / pageSize),
    hasNextPage: end < mockUsers.length,
    hasPreviousPage: page > 1,
  };
}

/**
 * Search users by username or email
 */
export function searchUsers(query: string) {
  const searchTerm = query.toLowerCase();
  return mockUsers.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.nip05?.toLowerCase().includes(searchTerm),
  );
}
