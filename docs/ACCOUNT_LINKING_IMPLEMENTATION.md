# Account Linking Implementation Summary

## Overview
Implemented a complete account linking system that allows users to connect multiple authentication providers to a single account while preserving their original authentication method.

## Key Features

### 1. Multiple Provider Support
- **Nostr (NIP-07)**: Browser extension-based authentication
- **Email**: Magic link verification for security
- **GitHub**: OAuth 2.0 flow

### 2. Security Features
- Email linking requires verification via magic link (prevents unauthorized linking)
- OAuth state validation to prevent CSRF attacks
- Session verification for all linking operations
- One-time use verification tokens with expiration

### 3. Authentication Hierarchy
- Preserves original `primaryProvider` and `profileSource`
- Nostr-first accounts remain Nostr-first even after linking OAuth providers
- OAuth-first accounts remain OAuth-first even after linking Nostr

## Implementation Details

### Backend Endpoints

#### `/api/account/link`
- Links Nostr accounts using pubkey
- Validates accounts aren't already linked

#### `/api/account/send-link-verification`
- Sends verification emails for email linking
- Generates secure verification tokens

#### `/api/account/verify-email-link`
- Verifies email tokens and completes linking
- Ensures one-time token usage

#### `/api/account/link-oauth`
- Initiates GitHub OAuth flow for linking
- Generates secure state parameters

#### `/api/account/oauth-callback`
- Handles GitHub OAuth callbacks
- Exchanges code for access token
- Links GitHub account to user

### Frontend Components

#### `LinkedAccountsManager`
- Main component for managing linked accounts
- Shows all available providers
- Disables current provider with tooltip
- Handles all linking flows

#### `ProfileTabs`
- Client component for tab management
- Handles OAuth callback success/error messages
- Provides user feedback via toasts

### Database Schema
```typescript
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... OAuth tokens
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model User {
  primaryProvider String?  // Tracks original auth method
  profileSource   String?  // Determines profile data source
  // ... other fields
}
```

## Configuration

### Environment Variables
```bash
# Standard NextAuth
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Optional: Separate GitHub app for linking
GITHUB_LINK_CLIENT_ID=xxx  
GITHUB_LINK_CLIENT_SECRET=xxx
```

### GitHub OAuth Setup
1. **Option A**: Create separate OAuth app for linking
   - Callback URL: `https://yourdomain.com/api/account/oauth-callback`
   
2. **Option B**: Update existing app to support both callbacks
   - Add both callback URLs (GitHub only allows one, so Option A is preferred)

## User Flow

### Linking Additional Accounts
1. User signs in with primary provider (e.g., Nostr)
2. Goes to Profile > Accounts tab
3. Clicks "Link [Provider]" button
4. Provider-specific flow:
   - **Nostr**: Prompts for NIP-07 extension permission
   - **Email**: Shows dialog, sends verification email
   - **GitHub**: Redirects to GitHub OAuth, then back

### Result
- User can sign in with any linked provider
- Original authentication method is preserved
- Profile data source remains consistent

## Testing Checklist

- [x] Nostr account linking via NIP-07
- [x] Email account linking with verification
- [x] GitHub OAuth flow initiation
- [x] Proper error handling and user feedback
- [x] Current provider button disabled
- [x] Primary provider preservation
- [x] Profile source consistency

## Known Issues

1. **GitHub OAuth Redirect URI**: Requires GitHub app configuration update
   - Solution: Create separate OAuth app or update existing app settings

## Security Considerations

1. **Email Verification**: Required to prevent unauthorized account takeover
2. **Token Expiration**: All verification tokens expire after 1 hour
3. **One-Time Use**: Tokens are deleted after successful use
4. **Session Validation**: All operations require authenticated session
5. **Provider Uniqueness**: Each provider account can only be linked to one user