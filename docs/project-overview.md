# Project Overview

## Project Summary

**Project Name:** PlebDevs ⚡️ - Developer education, content, and community platform built on Nostr and fully Lightning integrated.

**Project Type:** Decentralized Developer Education Platform Built on Nostr and Lightning

**Development Approach:** Static frontend rebuild with fake data that matches production data models. Focus on creating a fully functional frontend experience before implementing backend Nostr and Lightning integration.

**Timeline:** 6-8 weeks (3 phases)

**Current Focus:** Frontend-only implementation with mock data structures that align with the production database schema.

## Project Purpose & Vision

### Core Mission

Rebuild PlebDevs.com as a configurable, self-hostable course and content and community platform that works great as a web app but also seamlessly interoperates with Nostr and Lightning to deliver a powerful educational experience for developers.

### Why This Project?

PlebDevs represents a unique approach to developer education by combining:

- **Decentralized Content**: All content published to and pulled from Nostr relays
- **Lightning Integration**: Seamless monetization and micropayments for educational content
- **Open Source**: Self-hostable platform that can be customized and extended
- **Community-Driven**: Integration with Discord, StackerNews, and Nostr communities

### Success Metrics

- Responsive, modern UI that works seamlessly across devices
- Smooth content browsing and discovery experience
- Functional course progression and user progress tracking
- Clean admin interface for content creation and management
- Accurate data models that will seamlessly integrate with future backend
- Performance optimized for large content catalogs

## Target Audience

### Primary Users

- **Developer Students** - Learning Bitcoin, Lightning, and Nostr development
- **Content Creators** - Developers sharing educational content and courses
- **Bitcoin Developers** - Experienced developers teaching others
- **Self-Hosters** - Users wanting to run their own educational platforms
- **Privacy-Conscious Learners** - Users preferring decentralized educational platforms

### User Personas

1. **Alex the Bitcoin Developer** - Experienced developer teaching Lightning development
2. **Sarah the Student** - Learning Bitcoin development, wants structured courses
3. **Marcus the Content Creator** - Wants to monetize educational content with Lightning
4. **Lisa the Self-Hoster** - Wants to run educational platform for her company
5. **Jordan the Community Manager** - Manages developer communities across platforms

## Core Features & Functionality

### Phase 1: Static Frontend with Mock Data (Weeks 1-3)

**Goal:** Complete frontend experience with realistic mock data

#### Page Structure

- **Home Page**: Hero banner with three content carousels (courses, videos, documents)
- **Content Page**: Filterable grid view of all content by tags
- **Profile Page**: User profile with purchases, progress, and relay configuration
- **Feeds Page**: Multi-platform feeds (Global, Discord, Nostr, StackerNews)
- **About Page**: Platform information and documentation
- **Create Page**: Admin forms for content creation (course, video, document)
- **Individual Content Page**: Single content item display
- **Course Page**: Course lessons and structured content

#### Content Management

- **Content Types**:
  - Documents: Markdown-based educational content
  - Videos: Rich media content with embedded videos
  - Courses: Structured learning paths combining multiple content pieces
- **Organization**: Tag-based content categorization and filtering
- **Search**: Full-text search across all content types
- **Progress Tracking**: User progress through courses and lessons

#### User Experience

- **Authentication UI**: Multiple signup methods (Nostr, Email, GitHub, Anonymous)
- **Profile Management**: User profiles with Nostr integration mockups
- **Content Discovery**: Browsing, searching, and filtering content
- **Learning Progress**: Course completion tracking and badges
- **Monetization UI**: Subscription tiers and payment interfaces

### Phase 2: Enhanced UI & Admin Features (Weeks 4-5)

**Goal:** Complete admin interface and advanced user features

#### Admin Interface

- **Content Creation**: Rich forms for creating courses, videos, and documents
- **Content Management**: Draft system with preview capabilities
- **User Management**: User role management and subscription handling
- **Analytics Dashboard**: Mock analytics for content performance
- **Platform Configuration**:
  - Visual theme editor with real-time preview
  - Component styling and layout customization
  - Branding and color scheme management
  - Feature toggle controls
  - JSON configuration file management

#### Advanced Features

- **Subscription System**: Multiple subscription tiers with different benefits
- **Badge System**: Achievement system with visual badges
- **Community Integration**: Feed aggregation from multiple platforms
- **Calendar Integration**: 1:1 tutoring calendar system
- **Export Features**: Content export in multiple formats

### Phase 3: Polish & Optimization (Weeks 6-8)

**Goal:** Production-ready frontend with optimized performance

#### Performance Optimization

- **Code Splitting**: Optimized bundle sizes for fast loading
- **Image Optimization**: Responsive images and lazy loading
- **Caching**: Client-side caching for improved performance
- **PWA Features**: Progressive Web App capabilities
- **Mobile Optimization**: Responsive design for all screen sizes

#### User Experience Polish

- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Comprehensive loading and error states
- **Accessibility**: WCAG compliance and keyboard navigation
- **Internationalization**: Multi-language support preparation
- **Theme System**: Light/dark mode and customization options

## Technical Scope

### Core Technologies

- **Frontend Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS with Shadcn components
- **Language:** TypeScript for type safety
- **State Management:** React Context and local state
- **Data Fetching:** Next.js built-in data fetching
- **Authentication:** NextAuth.js (mocked for static version)

### UI Components & Libraries

- **Component Library:** Shadcn/ui with fully configurable, generic components
- **Icons:** Lucide React (configurable icon sets)
- **Forms:** React Hook Form with Zod validation
- **Notifications:** Shadcn Toast components (configurable styling)
- **Modals:** Shadcn Dialog components (configurable themes)
- **Charts:** Recharts for analytics visualizations (configurable colors/themes)
- **Configuration:** JSON-based theming and component configuration system

### Data Architecture

- **Mock Data Structure:** Aligns with production Prisma schema
- **API Layer:** Mock API responses using Next.js API routes
- **Type Safety:** TypeScript interfaces matching database models
- **Data Validation:** Zod schemas for all data structures
- **Error Handling:** Comprehensive error boundaries and handling
- **Configuration System:** JSON-based configuration for UI components, themes, and platform settings

### Key Integrations (Mocked)

- **Nostr Integration:** Mock NDK and nostr-tools functionality
- **Lightning Payments:** Mock Bitcoin-Connect and Alby SDK
- **Authentication:** Mock multi-provider authentication
- **File Storage:** Mock file upload and storage
- **Email Service:** Mock email notifications

### Configuration System

- **Component Configuration:** JSON-based Shadcn component theming and styling
- **Platform Branding:** Configurable logos, colors, fonts, and layouts
- **Admin Interface:** Visual configuration tools for non-technical users
- **Theme Management:** Light/dark mode and custom theme creation
- **Feature Toggles:** Enable/disable platform features via configuration
- **Content Templates:** Configurable content layouts and structures

## Data Models & Schema

### Core Models

Based on the provided Prisma schema, the frontend will work with these key entities:

#### User Model

- Authentication: Multiple methods (Nostr, Email, GitHub, Anonymous)
- Profile: Avatar, username, bio, social links
- Subscriptions: Role-based access with subscription management
- Progress: Course completion and lesson tracking
- Lightning: Custom Lightning addresses and NIP-05 identities

#### Content Models

- **Resources**: Base content with pricing and metadata
- **Courses**: Structured learning paths with lessons
- **Lessons**: Individual content pieces within courses
- **Drafts**: Content creation workflow with preview

#### Commerce Models

- **Purchases**: Individual content purchases
- **Subscriptions**: Recurring access with different tiers
- **Badges**: Achievement system with course completion rewards

#### Platform Models

- **Feeds**: Multi-platform content aggregation
- **Configuration**: Platform settings and customization
- **Analytics**: Usage tracking and performance metrics

## Page Specifications

### Home Page

- **Hero Section**: Platform introduction with key value propositions
- **Content Carousels**: Three horizontal scrollable sections:
  - Featured Courses: Structured learning paths
  - Latest Videos: Rich media content
  - Popular Documents: Text-based tutorials and guides
- **Statistics**: User count, content count, community metrics
- **Call-to-Action**: Subscription signup and getting started

### Content Page

- **Filter System**: Tag-based filtering with search
- **Grid Layout**: Responsive content grid with previews
- **Sorting Options**: By date, popularity, difficulty, price
- **Pagination**: Efficient content loading and navigation
- **Content Cards**: Title, summary, tags, price, and progress indicators

### Profile Page

- **User Information**: Profile details from Nostr and platform
- **Subscription Status**: Current plan and billing information
- **Progress Tracking**: Course completion and achievement badges
- **Purchase History**: Individual content purchases
- **Platform Settings**: Relay configuration and preferences
- **Lightning Integration**: Custom addresses and wallet connection

### Feeds Page

- **Multi-Platform Feeds**: Separate tabs for different sources:
  - Global: General developer content
  - Discord: Community discussions (read-only)
  - Nostr: Decentralized social updates
  - StackerNews: Bitcoin development news (~devs territory)
- **Real-time Updates**: Live feed updates with timestamps
- **Content Filtering**: Tag-based filtering within feeds
- **Engagement**: Zap buttons and social interactions

### Create Page (Admin)

- **Content Type Selection**: Course, Video, or Document creation
- **Rich Editor**: Markdown editor with preview
- **Metadata Management**: Tags, pricing, and publication settings
- **Draft System**: Save drafts and preview before publishing
- **Media Upload**: Image and video upload capabilities
- **Course Builder**: Drag-and-drop lesson ordering

### Individual Content Page

- **Content Display**: Rich content rendering with media support
- **Progress Tracking**: Lesson completion and bookmarking
- **Engagement**: Zap buttons and social sharing
- **Related Content**: Suggestions based on tags and user history
- **Comments**: Community discussion (future integration)

### Course Page

- **Course Overview**: Description, instructor, and learning objectives
- **Lesson List**: Structured curriculum with progress indicators
- **Progress Tracking**: Visual progress bar and completion status
- **Prerequisites**: Required knowledge and previous courses
- **Certificate**: Completion certificate and badge system

## Configuration System Details

### JSON Configuration Architecture

The platform uses a comprehensive JSON configuration system that allows complete customization without code changes:

#### Component Configuration (`/config/components/`)

- **Button Variants**: Primary, secondary, outline, ghost button styles
- **Card Layouts**: Different card designs for courses, videos, documents
- **Typography**: Heading styles, body text, and spacing configurations
- **Form Elements**: Input styles, validation messages, form layouts
- **Navigation**: Header, sidebar, and footer styling and behavior

#### Theme Configuration (`/config/themes/`)

- **Color Schemes**: Primary, secondary, accent, and neutral color palettes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale for margins, padding, and gaps
- **Animations**: Transition timings and easing functions
- **Breakpoints**: Responsive design breakpoints and grid systems

#### Platform Configuration (`/config/platform/`)

- **Feature Toggles**: Enable/disable specific platform features
- **Content Settings**: Default content layouts and display options
- **Subscription Tiers**: Pricing, features, and access levels
- **Integration Settings**: Nostr relay preferences, Lightning configurations
- **Branding**: Logo, favicon, meta tags, and social sharing images

### Admin Configuration Interface

- **Visual Editor**: Real-time preview of theme changes
- **Component Playground**: Test component variants and configurations
- **Export/Import**: Share configurations between installations
- **Version Control**: Track and revert configuration changes
- **Live Preview**: See changes without deployment

### Self-Hosting Customization

- **White-label Ready**: Complete branding customization
- **Institution Themes**: Pre-built themes for educational institutions
- **Community Themes**: Shareable theme marketplace
- **Custom Components**: Extend base components with custom variants
- **Plugin System**: Add custom functionality through configuration

## Success Criteria

### Phase 1 Completion Metrics

- [ ] All seven core pages implemented and functional
- [ ] Responsive design working across desktop, tablet, and mobile
- [ ] Mock data structures match production schema exactly
- [ ] Content filtering and search functionality working
- [ ] User authentication flow complete (with mocked backends)
- [ ] Performance metrics: <3s page load, <100ms interactions

### Phase 2 Completion Metrics

- [ ] Complete admin interface for content creation
- [ ] Advanced filtering and sorting across all content types
- [ ] Subscription tier system with different access levels
- [ ] Badge system with visual achievements
- [ ] Multi-platform feed aggregation (mocked)
- [ ] Calendar integration for 1:1 sessions
- [ ] JSON configuration system for component theming and platform customization
- [ ] Visual theme editor with real-time preview functionality
- [ ] Generic Shadcn components with full configuration support

### Phase 3 Completion Metrics

- [ ] Production-ready performance optimization
- [ ] Complete accessibility compliance (WCAG 2.1 AA)
- [ ] Comprehensive error handling and loading states
- [ ] PWA capabilities with offline support
- [ ] Theme system with customization options
- [ ] Internationalization framework ready

### Overall Project Success

- [ ] Pixel-perfect recreation of existing PlebDevs.com functionality
- [ ] Clean, maintainable codebase ready for backend integration
- [ ] Comprehensive documentation for future development
- [ ] Performance optimized for large content catalogs
- [ ] User experience competitive with top educational platforms
- [ ] Data models that seamlessly integrate with future Nostr/Lightning backend

## Technical Architecture

### Frontend Structure

```
/components
  /ui - Shadcn/ui components (generic, configurable)
  /forms - Form components with configurable styling
  /layout - Layout components (header, footer, sidebar)
  /content - Content display components
  /auth - Authentication components
  /admin - Admin configuration interfaces
/pages - Next.js pages
/lib - Utility functions and configurations
/hooks - Custom React hooks
/types - TypeScript type definitions
/data - Mock data and API responses
/config - JSON configuration files
  /themes - Theme configuration files
  /components - Component styling configs
  /platform - Platform feature configs
/styles - Global styles and Tailwind configuration
```

### Data Flow

1. **Static Data**: Mock data files matching production schema
2. **API Layer**: Next.js API routes for mock backend responses
3. **Client State**: React Context for user authentication and preferences
4. **Local Storage**: Browser storage for user preferences and progress
5. **Type Safety**: End-to-end TypeScript for data integrity

### Component Architecture

- **Atomic Design**: Generic Shadcn Button, Input, Card components (fully configurable)
- **Molecule Components**: SearchBar, ContentCard, UserProfile (themed via JSON config)
- **Organism Components**: Header, ContentGrid, CoursePlayer (layout configurable)
- **Template Components**: Page layouts and structures (customizable templates)
- **Page Components**: Full page implementations (theme-aware)
- **Configuration Layer**: JSON-driven component styling and behavior modification

## Development Workflow

### Setup & Configuration

1. **Project Initialization**: Next.js 14 with TypeScript and Tailwind
2. **Component Library**: Shadcn/ui integration with configuration system
3. **Configuration Framework**: JSON-based theming and component configuration
4. **Mock Data**: Create comprehensive mock data matching schema
5. **Type Definitions**: Generate TypeScript types from Prisma schema and config files
6. **Development Tools**: ESLint, Prettier, and development scripts

### Development Phases

1. **Week 1-2**: Core pages and components
2. **Week 3-4**: Advanced features and admin interface
3. **Week 5-6**: Performance optimization and polish
4. **Week 7-8**: Testing, documentation, and deployment preparation

### Quality Assurance

- **Code Quality**: ESLint and Prettier for consistent code style
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Unit tests for critical components
- **Performance**: Lighthouse audits and Core Web Vitals
- **Accessibility**: WCAG compliance testing

## Deployment & Hosting

### Static Deployment

- **Platform**: Vercel for optimal Next.js hosting
- **Domain**: Custom domain configuration
- **SSL**: Automatic HTTPS with certificate management
- **CDN**: Global content delivery for performance
- **Environment Variables**: Secure configuration management

### Performance Optimization

- **Bundle Analysis**: Webpack Bundle Analyzer for optimization
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic and manual code splitting
- **Caching**: Browser and CDN caching strategies
- **Monitoring**: Performance monitoring and error tracking

## Future Integration Planning

### Backend Integration Readiness

- **API Compatibility**: Frontend designed for easy backend integration
- **Data Models**: Exact match with production Prisma schema
- **Authentication**: Ready for NextAuth.js with real providers
- **Real-time Features**: WebSocket integration planning
- **Database**: Prepared for PostgreSQL and Redis integration

### Nostr & Lightning Integration

- **NDK Integration**: Component structure ready for Nostr Development Kit
- **Lightning Payments**: Bitcoin-Connect integration points identified
- **Wallet Connection**: Alby SDK integration planning
- **Content Publishing**: NIP-23 long-form content preparation
- **Monetization**: NIP-99 and subscription system integration

## Next Steps

1. **Environment Setup**: Initialize Next.js project with all dependencies
2. **Shadcn/ui Integration**: Set up Shadcn/ui components with Tailwind CSS
3. **Configuration System**: Build JSON-based theming and component configuration framework
4. **Mock Data**: Create comprehensive mock data matching production schema
5. **Core Pages**: Implement home, content, and profile pages with configurable components
6. **Navigation**: Build responsive navigation and routing system
7. **Authentication**: Implement mock authentication with all providers
8. **Admin Configuration**: Build visual theme editor and configuration interface
9. **Content Management**: Build content creation and management interfaces
10. **Performance**: Optimize for production deployment

---

This project overview provides a comprehensive roadmap for rebuilding PlebDevs.com as a static frontend that will seamlessly integrate with future Nostr and Lightning backend implementation. The focus on matching production data models ensures a smooth transition when backend services are implemented.
