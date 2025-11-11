# Profile System Architecture

## Overview

The profile system implements a sophisticated multi-account management architecture that aggregates data from multiple authentication providers while respecting user preferences for data authority. The system supports linking accounts across Nostr, GitHub, and Email providers with intelligent data prioritization.

## Core Concepts

### Authentication Hierarchy

The system recognizes two primary authentication paradigms:

#### 🔵 Nostr-First Accounts
- **Providers**: NIP-07 browser extension, Anonymous
- **Characteristics**: 
  - Nostr profile is the source of truth
  - Profile syncs from Nostr relays on sign-in
  - User controls keys via browser extension
  - Basic fields (name, email) are read-only in settings

#### 🟠 OAuth-First Accounts  
- **Providers**: Email magic links, GitHub OAuth
- **Characteristics**:
  - Platform manages profile data
  - Can edit all profile fields directly
  - Background Nostr capabilities with ephemeral keys
  - Profile stored in database

### Automatic Promotions

Linking flows automatically migrate users along the chain:
- Anonymous → OAuth-first: linking email/GitHub immediately switches `primaryProvider/profileSource` to OAuth while keeping the server-managed keypair.
- OAuth-first → Nostr-first: linking a NIP-07 pubkey copies the new pubkey into `User.pubkey`, clears `privkey`, and runs a Nostr sync so DB fields match the decentralized profile before the response returns.
- Once a user becomes Nostr-first, subsequent OAuth logins behave as secondary credentials; the system never reverts without an explicit preference change.

### Anonymous Bootstrap Behavior
- Anonymous sign-ins generate an `anon_XXXX` username and DiceBear avatar as placeholders.
- These placeholders are explicitly treated as “unset” during aggregation: any linked OAuth provider with real profile data overrides them immediately.
- Once the user updates their Nostr profile (via sync or settings), those non-placeholder values regain priority because the profile remains Nostr-first unless they switch sources.
- When richer data replaces the placeholder, the system backfills the `User.username`, `User.avatar`, and `User.email` columns so settings forms stay in sync with what the public profile shows.
- Linking a real Nostr account erases the platform-managed private key to enforce user custody from that point onward.

### Profile Source Priority

Users can configure how their profile data is prioritized:

```typescript
// Nostr-First Priority
nostr → current session → oauth providers

// OAuth-First Priority
current session → oauth providers → nostr
```

## Data Architecture

### Profile Aggregation

The system aggregates profile data from all linked accounts into a unified structure:

```typescript
interface AggregatedProfile {
  // Core fields with source tracking
  name?: { value: string; source: string }
  email?: { value: string; source: string }
  username?: { value: string; source: string }
  image?: { value: string; source: string }
  banner?: { value: string; source: string }
  about?: { value: string; source: string }
  
  // Social links
  website?: { value: string; source: string }
  github?: { value: string; source: string }
  twitter?: { value: string; source: string }
  location?: { value: string; source: string }
  company?: { value: string; source: string }
  
  // Nostr specific
  pubkey?: { value: string; source: string }
  nip05?: { value: string; source: string }
  lud16?: { value: string; source: string }
  
  // All linked accounts
  linkedAccounts: LinkedAccountData[]
  
  // Metadata
  primaryProvider: string | null
  profileSource: string | null
  totalLinkedAccounts: number
}
```

### Data Flow

#### Profile Display Flow
1. User visits profile tab
2. Component fetches `/api/profile/aggregated`
3. API aggregates data from all sources:
   - Current session data from database
   - GitHub profile via API (if linked)
   - Nostr profile from relays (if linked)
4. Returns unified profile with source tracking
5. UI displays fields with provider badges

#### Settings Update Flow
1. User edits fields in settings
2. Calls server actions based on field type:
   - `updateBasicProfile` for name/email (OAuth-first only)
   - `updateEnhancedProfile` for NIP-05/Lightning/banner (all users)
3. Preferences and primary provider managed via `/api/account/preferences` and `/api/account/primary`
4. Data saved to database
5. Page revalidated to show changes

## Implementation Components

### Backend Services

#### Profile Aggregator (`/src/lib/profile-aggregator.ts`)
Core aggregation logic that:
- Fetches data from multiple sources
- Implements priority-based field selection
- Handles provider-specific API calls
- Returns unified profile with source tracking

```typescript
export async function getAggregatedProfile(userId: string): Promise<AggregatedProfile> {
  // Fetch user with linked accounts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true }
  })
  
  // Aggregate from each provider
  for (const account of user.accounts) {
    switch (account.provider) {
      case 'github':
        // Fetch from GitHub API
      case 'nostr':
        // Fetch from Nostr relays
      case 'email':
        // Use email data
    }
  }
  
  // Apply priority-based selection
  // Return aggregated profile
}
```

#### Database Schema
```prisma
model User {
  id               String    @id @default(uuid())
  pubkey           String?   @unique
  privkey          String?
  email            String?   @unique
  username         String?   @unique
  avatar           String?
  banner           String?
  nip05            String?
  lud16            String?
  
  // Account linking fields
  primaryProvider  String?   // Primary authentication provider
  profileSource    String?   @default("oauth") // "nostr" or "oauth"
  
  accounts         Account[]
  sessions         Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  access_token      String?
  refresh_token     String?
  
  user              User    @relation(fields: [userId], references: [id])
  
  @@unique([provider, providerAccountId])
}
```

### Frontend Components

#### Enhanced Profile Display (`/src/app/profile/components/enhanced-profile-display.tsx`)
Main profile display component featuring:
- Aggregated data from all linked accounts
- Visual provider badges for each field
- Linked accounts overview
- Account configuration display
- Loading states with skeleton UI
- Copy functionality for keys/identifiers

#### Simple Settings (`/src/app/profile/components/simple-settings.tsx`)
Streamlined settings component with:
- Account-type detection derived from `profileSource`, `primaryProvider`, and `session.provider`
- Basic profile editing (OAuth-first only)
- Enhanced profile fields (all users)
- Profile source configuration
- Manual sync from providers
- Real-time validation and feedback
- Contextual messaging for anonymous and Nostr-first accounts (e.g., “Managed via Nostr relays”)

#### Linked Accounts Manager (`/src/components/account/linked-accounts.tsx`)
Account linking interface providing:
- Available provider display
- Current provider detection and disabling
- Provider-specific linking flows
- Automatic redirect back to `/profile` after successful linking so every tab (and the sticky header) reloads in a consistent state

### Identity Synchronisation Events

- `src/lib/profile-events.ts` emits `profile:updated` whenever profile data changes (linking, unlinking, server actions).
- The header (`src/components/layout/header.tsx`) listens for this event, fetches `/api/profile/aggregated`, and persists the latest avatar/name in localStorage so it stays in sync with the Profile tab after migrations.
- Email verification
- OAuth initiation

## Visual Design System

### Provider Badges

Each field displays its data source with color-coded badges:

| Provider | Color | Icon | Usage |
|----------|-------|------|-------|
| Nostr | Blue | Key | Nostr profile data |
| GitHub | Gray | GitHub | GitHub OAuth data |
| Email | Green | Mail | Email provider data |
| Profile | Purple | User | Session/database data |
| Current | Orange | User | Active session data |

### UI Organization

#### Profile Tab
- **Header**: Avatar, name, account type badges
- **Basic Information**: Name, email, username, location
- **Nostr Information**: Public key, NIP-05, Lightning
- **Extended Profile**: About, website, social links
- **Linked Accounts**: Overview of all connections
- **Account Configuration**: Settings summary

#### Settings Tab
- **Account Type**: Visual indicator of Nostr-first vs OAuth-first
- **Basic Profile**: Editable fields with provider badges
- **Enhanced Profile**: Nostr-specific configuration
- **Profile Configuration**: Source priority selector
- **Sync Options**: Manual sync buttons per provider

#### Accounts Tab
- **Link Buttons**: One per provider type
- **Current Provider**: Disabled with tooltip
- **Email Dialog**: Verification flow for email
- **Success Messages**: Toast notifications

## Security Implementation

### Account Linking Security

1. **Email Verification**
   - Sends 6-digit code + link to `/verify-email?ref=...`
   - User submits code via POST `/api/account/verify-email`
   - One-time use with 1-hour expiration; record deleted on success/expiry

2. **OAuth State Validation**
   - Base64-encoded state with strict length + JSON schema validation
   - Session/userId verification on callback
   - Provider account uniqueness enforced

3. **Session Requirements**
   - All operations require authenticated session
   - User ID verification for all updates
   - Role-based access where applicable

### Data Protection

1. **Input Validation**
   - Zod schemas for all inputs
   - XSS prevention via sanitization
   - SQL injection prevention via Prisma

2. **Provider Verification**
   - Verify provider exists before operations
   - Check account ownership
   - Prevent duplicate linkings

## Performance Optimizations

### Fetch & Retry Strategy
- No server-side cache for `/api/profile/aggregated` at present
- Provider data fetched on demand with retry/backoff and 429 handling (GitHub)
- Skeleton loading states during fetch in the UI

### Query Optimization
- Batch fetch linked accounts
- Single query for user + accounts
- Parallel provider API calls
- Minimal database round trips

## User Experience Features

### Smart Defaults
- Auto-detect current provider
- Intelligent field prioritization
- Contextual help text
- Progressive disclosure

### Visual Feedback
- Loading skeletons
- Toast notifications
- Disabled states with tooltips
- Success/error indicators

### Accessibility
- ARIA labels on all inputs
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Testing Checklist

### Profile Display
- ✅ Aggregation from multiple sources
- ✅ Provider badge display
- ✅ Loading states
- ✅ Copy functionality
- ✅ Responsive layout

### Settings
- ✅ Field editing based on account type
- ✅ Provider badges on fields
- ✅ Profile source configuration
- ✅ Manual sync functionality
- ✅ Form validation

### Account Linking
- ✅ Nostr via NIP-07
- ✅ Email with verification
- ✅ GitHub OAuth flow
- ✅ Current provider disabled
- ✅ Unlink functionality

### Data Integrity
- ✅ Profile source priority respected
- ✅ Primary provider preserved
- ✅ Proper data aggregation
  

## Future Enhancements

### Planned Features
1. **Field-level provider selection** - Choose provider per field
2. **Sync scheduling** - Automatic periodic syncs
3. **Conflict resolution** - UI for data conflicts
4. **Profile export/import** - Data portability
5. **Sync history** - Track all operations
6. **Provider health monitoring** - API status display

### Architecture Improvements
1. **WebSocket updates** - Real-time profile changes
2. **Optimistic updates** - Instant UI feedback
3. **Batch operations** - Bulk account management
4. **Advanced caching** - Edge caching support
5. **GraphQL integration** - Flexible data fetching
