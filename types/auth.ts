/**
 * @fileoverview Authentication and user-related TypeScript interfaces
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Core User model matching Prisma schema
export interface User {
  id: string;
  pubkey?: string | null;
  privkey?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  username?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  nip05?: string | null;
  lud16?: string | null;
  role?: Role | null;
  platformNip05?: PlatformNip05 | null;
  platformLightningAddress?: PlatformLightningAddress | null;
}

// Role and subscription management
export interface Role {
  id: string;
  userId: string;
  subscribed: boolean;
  admin: boolean;
  subscriptionType: string;
  subscriptionStartDate?: Date | null;
  lastPaymentAt?: Date | null;
  subscriptionExpiredAt?: Date | null;
  nwc?: string | null;
}

// Platform services
export interface PlatformNip05 {
  id: string;
  userId: string;
  pubkey: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformLightningAddress {
  id: string;
  userId: string;
  name: string;
  allowsNostr: boolean;
  description?: string | null;
  maxSendable: bigint;
  minSendable: bigint;
  invoiceMacaroon: string;
  lndCert?: string | null;
  lndHost: string;
  lndPort: string;
}

// NextAuth models
export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

// Authentication types
export type AuthProvider = 'nostr' | 'email' | 'github' | 'anonymous';
export type SubscriptionType = 'monthly' | 'yearly';

// Extended types with relationships for UI
export interface UserWithDetails extends User {
  role?: Role | null;
  purchases: Purchase[];
  userCourses: UserCourse[];
  userLessons: UserLesson[];
  userBadges: UserBadge[];
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    provider: AuthProvider,
    credentials?: LoginCredentials,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

// Login credentials for different providers
export interface EmailCredentials {
  email: string;
  password: string;
}

export interface NostrCredentials {
  pubkey: string;
  privkey?: string;
}

export interface GitHubCredentials {
  token: string;
}

export type LoginCredentials =
  | EmailCredentials
  | NostrCredentials
  | GitHubCredentials;

// Import required types for relationships
import type { Purchase, UserCourse, UserLesson, UserBadge } from './content';
