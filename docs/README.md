# Documentation Index

## Profile & Settings System

Comprehensive documentation for the multi-account profile management system.

### Core Documentation

#### 📘 [Profile System Architecture](./profile-system-architecture.md)
Complete architectural overview of the profile system including authentication hierarchy, data aggregation, and component structure.

#### 📗 [Profile API Reference](./profile-api-reference.md)
Detailed API documentation for all profile-related endpoints, server actions, and error handling.

#### 📙 [Profile Implementation Guide](./profile-implementation-guide.md)
Step-by-step implementation guide with code examples, testing strategies, and troubleshooting.

### Setup Guides

#### 🔧 [GitHub OAuth Setup](./GITHUB_OAUTH_SETUP.md)
Instructions for configuring GitHub OAuth for account linking functionality.

#### 🔗 [Account Linking Implementation](./ACCOUNT_LINKING_IMPLEMENTATION.md)
Technical details of the account linking system implementation.

## Content & Theming

#### 📄 [Content Data Models](./content_data_models.md)
Documentation of content types, data structures, and relationships.

#### 🎨 [Theme Configuration](./theme-configuration.md)
Guide to the theming system with 47 complete theme configurations.

## Nostr Integration

#### ⚡ [Snstr Documentation](./snstr_readme.md)
Overview of the Snstr library for Nostr protocol integration.

#### 🔑 [NIP-01 Implementation](./snstr_nip01_readme.md)
Details on NIP-01 (Basic protocol flow) implementation.

#### 🔐 [NIP-07 Implementation](./snstr_nip07_readme.md)
Browser extension integration for Nostr authentication.

## Quick Links

### Profile System
- [Profile Aggregation Logic](./profile-system-architecture.md#data-architecture)
- [Account Linking Flow](./profile-implementation-guide.md#account-linking-flow)
- [API Endpoints](./profile-api-reference.md#table-of-contents)
- [Security Features](./profile-system-architecture.md#security-implementation)

### Common Tasks
- [Link a GitHub Account](./GITHUB_OAUTH_SETUP.md)
- [Configure Profile Priority](./profile-implementation-guide.md#configuration-options)
- [Implement Custom Provider](./profile-api-reference.md#oauth-linking-apis)
- [Test Account Linking](./profile-implementation-guide.md#testing-guidelines)

### Troubleshooting
- [OAuth Redirect Issues](./profile-implementation-guide.md#common-issues)
- [Email Verification Problems](./profile-implementation-guide.md#common-issues)
- [Profile Sync Failures](./profile-implementation-guide.md#common-issues)

## Documentation Standards

### File Naming
- Use lowercase with hyphens for file names
- Group related docs with common prefixes (e.g., `profile-*`)
- Keep setup guides separate with descriptive names

### Content Structure
1. **Overview** - High-level description
2. **Key Features** - Bullet points of main functionality
3. **Implementation** - Technical details with code
4. **Testing** - How to verify functionality
5. **Troubleshooting** - Common issues and solutions

### Code Examples
- Use TypeScript for all code examples
- Include imports when not obvious
- Add comments for complex logic
- Show both request and response for APIs

### Maintenance
- Update docs when implementation changes
- Keep API references in sync with code
- Test all code examples regularly
- Remove deprecated content promptly