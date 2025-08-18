# Profile System API Reference

## Table of Contents
- [Profile APIs](#profile-apis)
- [Account Management APIs](#account-management-apis)
- [Account Preferences APIs](#account-preferences-apis)
- [Sync APIs](#sync-apis)
- [OAuth Linking APIs](#oauth-linking-apis)
- [Email Linking APIs](#email-linking-apis)
- [Server Actions](#server-actions)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)

## Profile APIs

### GET /api/profile/aggregated

Fetches aggregated profile data from all linked accounts with source tracking.

**Authentication**: Required

**Response**: `200 OK`
```json
{
  "name": { 
    "value": "John Doe", 
    "source": "github" 
  },
  "email": { 
    "value": "john@example.com", 
    "source": "email" 
  },
  "username": { 
    "value": "johndoe", 
    "source": "nostr" 
  },
  "image": { 
    "value": "https://avatars.githubusercontent.com/...", 
    "source": "github" 
  },
  "banner": {
    "value": "https://example.com/banner.jpg",
    "source": "nostr"
  },
  "about": {
    "value": "Bitcoin developer and educator",
    "source": "nostr"
  },
  "website": {
    "value": "https://johndoe.com",
    "source": "github"
  },
  "location": {
    "value": "San Francisco, CA",
    "source": "github"
  },
  "company": {
    "value": "Bitcoin Corp",
    "source": "github"
  },
  "github": {
    "value": "johndoe",
    "source": "github"
  },
  "twitter": {
    "value": "@johndoe",
    "source": "nostr"
  },
  "pubkey": {
    "value": "npub1...",
    "source": "nostr"
  },
  "nip05": {
    "value": "john@nostr.example",
    "source": "nostr"
  },
  "lud16": {
    "value": "john@getalby.com",
    "source": "nostr"
  },
  "linkedAccounts": [
    {
      "provider": "github",
      "providerAccountId": "123456",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "image": "https://...",
        "location": "San Francisco, CA",
        "company": "Bitcoin Corp"
      },
      "isConnected": true,
      "isPrimary": true
    },
    {
      "provider": "nostr",
      "providerAccountId": "npub1...",
      "data": {
        "name": "John Doe",
        "about": "Bitcoin developer",
        "website": "https://johndoe.com",
        "nip05": "john@nostr.example",
        "lud16": "john@getalby.com",
        "pubkey": "npub1..."
      },
      "isConnected": true,
      "isPrimary": false
    }
  ],
  "primaryProvider": "github",
  "profileSource": "oauth",
  "totalLinkedAccounts": 2
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Failed to aggregate data

## Account Management APIs

### GET /api/account/linked

Returns all linked accounts for the current user.

**Authentication**: Required

**Response**: `200 OK`
```json
[
  {
    "provider": "github",
    "providerAccountId": "123456",
    "linkedAt": "2024-01-15T10:30:00Z",
    "isActive": true
  },
  {
    "provider": "nostr",
    "providerAccountId": "02a1...",
    "linkedAt": "2024-01-16T14:20:00Z",
    "isActive": true
  },
  {
    "provider": "email",
    "providerAccountId": "john@example.com",
    "linkedAt": "2024-01-17T09:15:00Z",
    "isActive": true
  }
]
```

### POST /api/account/link

Links a new account to the current user.

**Authentication**: Required

**Request Body**:
```json
{
  "provider": "nostr",
  "providerAccountId": "02a1..."
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Nostr account linked successfully",
  "account": {
    "provider": "nostr",
    "providerAccountId": "02a1...",
    "linkedAt": "2024-01-18T12:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid provider or missing data
- `409 Conflict` - Account already linked to another user
- `401 Unauthorized` - No valid session

### DELETE /api/account/unlink

Unlinks an account from the current user.

**Authentication**: Required

**Request Body**:
```json
{
  "provider": "github"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "GitHub account unlinked successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Cannot unlink primary provider
- `404 Not Found` - Account not linked
- `401 Unauthorized` - No valid session

## Account Preferences APIs

### GET /api/account/preferences

Fetches user's account preferences.

**Authentication**: Required

**Response**: `200 OK`
```json
{
  "profileSource": "oauth",
  "primaryProvider": "github"
}
```

### POST /api/account/preferences

Updates user's account preferences.

**Authentication**: Required

**Request Body**:
```json
{
  "profileSource": "nostr",
  "primaryProvider": "nostr"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "profileSource": "nostr",
  "primaryProvider": "nostr"
}
```

**Error Responses**:
- `400 Bad Request` - Provider not linked to account
- `401 Unauthorized` - No valid session

## Sync APIs

### POST /api/account/sync

Syncs profile data from a specific provider.

**Authentication**: Required

**Request Body**:
```json
{
  "provider": "github"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Profile synced from github",
  "updated": ["username", "avatar", "email", "location", "company"]
}
```

**Sync Behavior by Provider**:

#### GitHub Sync
- Fetches latest profile from GitHub API
- Updates: username, email, avatar, location, company
- Requires valid access_token

#### Nostr Sync
- Fetches profile from Nostr relays
- Updates: username, avatar, banner, nip05, lud16, about
- Uses relay pool for redundancy

#### Email Sync
- No external sync (email is static)
- Returns success with no updates

**Error Responses**:
- `400 Bad Request` - Provider not linked or unsupported
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Sync failed

## OAuth Linking APIs

### GET /api/account/link-oauth

Initiates OAuth flow for account linking.

**Authentication**: Required

**Query Parameters**:
- `provider` (required) - OAuth provider (currently "github")

**Example**: `/api/account/link-oauth?provider=github`

**Response**: `302 Redirect`
- Redirects to GitHub OAuth authorization page
- Includes encrypted state parameter for security

**OAuth Flow**:
1. User redirected to GitHub
2. User authorizes the application
3. GitHub redirects back to callback URL
4. Account linking completed

### GET /api/account/oauth-callback

Handles OAuth callback and completes account linking.

**Query Parameters**:
- `code` - OAuth authorization code from provider
- `state` - Encrypted state containing user info

**Response**: `302 Redirect`
- Success: Redirects to `/profile?tab=accounts&success=github_linked`
- Error: Redirects to `/profile?tab=accounts&error=[error_code]`

**Error Codes**:
- `session_mismatch` - User session expired or changed
- `already_linked` - Account already linked to another user
- `token_exchange_failed` - Failed to get access token
- `user_fetch_failed` - Could not retrieve provider profile
- `linking_failed` - Database operation failed

## Email Linking APIs

### POST /api/account/send-link-verification

Sends verification email for account linking.

**Authentication**: Required

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Verification email sent to john@example.com"
}
```

**Email Contents**:
- Subject: "Link your email to [Platform Name]"
- Contains verification link valid for 30 minutes
- **⚠️ SECURITY**: Link format uses reference ID, not token: `/verify-email?ref=[reference]`
- **Note**: Tokens are never exposed in URLs for security reasons

**Error Responses**:
- `400 Bad Request` - Invalid email format
- `409 Conflict` - Email already linked
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Failed to send email

### GET /api/account/verify-email-link

**⚠️ DEPRECATED**: This endpoint exposes tokens in URLs and should not be used in production.

**Recommended Approach**: Use `/verify-email` page with POST requests instead.

**Query Parameters**:
- `token` - Verification token from email (⚠️ SECURITY RISK)
- `email` - Email address to link

**Response**: `302 Redirect`
- Success: Redirects to `/profile?tab=accounts&success=email_linked`
- Error: Redirects to `/profile?tab=accounts&error=[error_code]`

**Verification Process**:
1. Token validated against database
2. Check token not expired (30 minutes TTL)
3. Link email to user account
4. Delete token (one-time use)

**Error Codes**:
- `invalid_token` - Token not found or invalid
- `token_expired` - Token older than 30 minutes
- `already_linked` - Email already linked

**Security Considerations**:
- Tokens in URLs can be logged in server logs and browser history
- Use verification page with POST requests instead
- Implement proper CSRF protection
- Ensure tokens are single-use and short-lived

### POST /verify-email (Recommended)

**Secure verification page that handles tokens in request body.**

**Query Parameters**:
- `ref` - Reference identifier (not the actual token)

**Request Body** (JSON):
```json
{
  "token": "verification_token_here"
}
```

**Response**: `302 Redirect`
- Success: Redirects to `/profile?tab=accounts&success=email_linked`
- Error: Redirects to `/verify-email?error=[error_code]`

**Security Benefits**:
- Tokens never appear in URLs or server logs
- CSRF protection can be implemented
- Better user experience with proper error handling
- Tokens can be validated server-side before processing

## Server Actions

### updateBasicProfile

Updates basic profile fields (name, email) for OAuth-first accounts only.

**Location**: `/src/app/profile/actions.ts`

**Input**:
```typescript
{
  name?: string    // Min: 1, Max: 100 characters
  email?: string   // Valid email format
}
```

**Returns**:
```typescript
{
  success: boolean
  message: string
  updates?: string[]  // Fields that were updated
  errors?: ZodIssue[] // Validation errors if any
}
```

**Restrictions**:
- Only available for OAuth-first accounts
- Nostr-first accounts cannot use this action
- Email must be unique across all users

### updateEnhancedProfile

Updates enhanced profile fields for all account types.

**Location**: `/src/app/profile/actions.ts`

**Input**:
```typescript
{
  nip05?: string   // Nostr address (user@domain.com)
  lud16?: string   // Lightning address  
  banner?: string  // Valid URL for banner image
}
```

**Returns**:
```typescript
{
  success: boolean
  message: string
  updates?: string[]     // Fields that were updated
  isNostrFirst?: boolean // Warning about potential override
  errors?: ZodIssue[]    // Validation errors if any
}
```

**Notes**:
- Available to all users
- For Nostr-first accounts, may be overridden by next sync
- URL validation for banner field

### updateAccountPreferences

Updates account configuration (profile source, primary provider).

**Location**: `/src/app/profile/actions.ts`

**Input**:
```typescript
{
  profileSource: 'nostr' | 'oauth'
  primaryProvider: string
}
```

**Returns**:
```typescript
{
  success: boolean
  message: string
  updates?: string[]  // Configuration items updated
  errors?: ZodIssue[] // Validation errors if any
}
```

**Validation**:
- Primary provider must be linked to account
- Profile source must be valid enum value

## Error Handling

All APIs return structured error responses following this format:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional context
}
```

### HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Operation completed |
| 302 | Redirect | OAuth flow redirects |
| 400 | Bad Request | Invalid input, missing params |
| 401 | Unauthorized | No session, expired session |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate, already exists |
| 500 | Internal Error | Server error, external API failure |

### Error Recovery

1. **Session Errors** (401)
   - Redirect to sign-in
   - Store return URL
   - Resume after auth

2. **Validation Errors** (400)
   - Display field-level errors
   - Highlight invalid inputs
   - Show help text

3. **Conflict Errors** (409)
   - Explain conflict
   - Offer resolution options
   - Link to support

4. **Server Errors** (500)
   - Show generic message
   - Log details server-side
   - Offer retry option

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars

# Email (for verification)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

### Optional Variables

```env
# GitHub OAuth (for GitHub linking)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Separate GitHub App for linking (optional)
GITHUB_LINK_CLIENT_ID=separate-app-client-id
GITHUB_LINK_CLIENT_SECRET=separate-app-secret

# Nostr Relays (defaults provided)
NOSTR_RELAYS=wss://relay.damus.io,wss://nos.lol

# Cache Configuration
CACHE_TTL=300000  # 5 minutes in ms
CACHE_MAX_SIZE=1000
```

### Development Variables

```env
# Development only
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

## Rate Limiting

API endpoints include rate limiting for security:

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/account/link | 10 requests | 1 hour |
| /api/account/sync | 20 requests | 1 hour |
| /api/account/send-link-verification | 5 requests | 1 hour |
| /api/profile/aggregated | 100 requests | 1 hour |

Rate limit headers included in responses:
- `X-RateLimit-Limit` - Maximum requests
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Reset timestamp

## CORS Configuration

APIs support CORS for cross-origin requests:

```typescript
// Allowed origins
const allowedOrigins = [
  process.env.NEXTAUTH_URL,
  'http://localhost:3000',
  'https://yourdomain.com'
]

// Allowed methods
const allowedMethods = ['GET', 'POST', 'DELETE', 'OPTIONS']

// Allowed headers
const allowedHeaders = [
  'Content-Type',
  'Authorization',
  'X-Requested-With'
]
```