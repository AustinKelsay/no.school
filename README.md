# PlebDevs ⚡️

> **Decentralized Developer Education Platform Built on Bitcoin and Nostr**

A modern, configurable educational platform that seamlessly integrates Bitcoin Lightning payments and Nostr protocols to deliver a sovereign learning experience for developers.

## 🎯 Vision

PlebDevs represents a new paradigm in developer education—combining the power of decentralized content publishing, Lightning-native monetization, and community-driven learning to create an educational platform that respects user sovereignty and developer freedom.

### Core Mission

Build a self-hostable, white-label educational platform that:

- **Publishes content to Nostr relays** for decentralized, censorship-resistant education
- **Integrates Lightning payments** for seamless creator monetization and micropayments
- **Operates as a progressive web app** with full offline capabilities
- **Supports complete customization** for institutions and organizations
- **Connects multiple communities** across Discord, Nostr, and StackerNews

## ✨ Key Features

### 🎓 **Learning Experience**

- **Structured Courses**: Multi-lesson learning paths with progress tracking
- **Rich Content Types**: Videos, documents, and interactive lessons
- **Achievement System**: Badges and certificates for course completion
- **Progress Analytics**: Detailed learning analytics and insights
- **Offline Support**: PWA capabilities for learning anywhere

### 🏗️ **Content Creation**

- **Rich Editor**: Markdown-based content creation with preview
- **Draft System**: Save and iterate on content before publishing
- **Media Management**: Image and video upload with optimization
- **Monetization Tools**: Lightning payment integration for creators
- **Analytics Dashboard**: Content performance and engagement metrics

### 🎨 **Platform Customization**

- **Visual Theme Editor**: Real-time theme customization with live preview
- **White-label Ready**: Complete branding and domain customization
- **Component Configuration**: JSON-based styling for all UI components
- **Feature Toggles**: Enable/disable platform features per instance
- **Multi-tenant Support**: Isolated environments for different organizations

### 🌐 **Community Integration**

- **Multi-platform Feeds**: Aggregate content from Discord, Nostr, and StackerNews
- **Social Features**: Zap content, share achievements, community discussions
- **Creator Tools**: Revenue tracking, audience analytics, engagement metrics
- **Mentorship System**: 1:1 tutoring and mentorship capabilities

## 🏗️ Tech Stack

### **Frontend Framework**

- **Next.js 14** with App Router for optimal performance and SEO
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for utility-first styling and configuration

### **UI & Components**

- **Shadcn/ui** - Fully configurable components built on Radix UI
- **Lucide React** - Consistent, configurable icon system
- **Recharts** - Beautiful, themeable data visualizations

### **State & Data**

- **React Context** - Simple, effective state management
- **TanStack Query** - Intelligent data fetching and caching
- **Zod** - Runtime validation for forms and configuration

### **Development Tools**

- **ESLint + Prettier** - Code quality and consistency
- **Husky + lint-staged** - Pre-commit quality checks
- **Jest + Playwright** - Comprehensive testing strategy

### **Future Integrations**

- **NDK (Nostr Development Kit)** - Decentralized content publishing
- **Bitcoin-Connect + Alby SDK** - Lightning payment integration
- **PostgreSQL + Prisma** - Production database layer

## 🎨 Design Philosophy

### **Minimalist Cypherpunk Aesthetic**

- Clean, technical interfaces that respect user intelligence
- Dark-first design with high contrast for readability
- Subtle Bitcoin/crypto cultural references integrated naturally
- Information density optimized for developers without visual clutter

### **Trustless Interface Design**

- Clear, verifiable information presentation
- No hidden complexity or misleading visual patterns
- Transparent interaction states and system feedback
- Honest representation of data and user progress

### **Sovereign User Experience**

- Self-explanatory interfaces requiring no external documentation
- Keyboard-first navigation with mouse as secondary input
- Configurable elements that respect user preferences
- No dark patterns or manipulative design elements

## 👥 User Personas

### 🎓 **Sarah the Student**

Learning Bitcoin development through structured courses with progress tracking and community support.

### 🧑‍💻 **Alex the Bitcoin Developer**

Sharing expertise through educational content while building reputation and earning Bitcoin.

### 🎬 **Marcus the Content Creator**

Monetizing educational content through Lightning payments and subscription tiers.

### 🏢 **Lisa the Self-Hoster**

Deploying a custom educational platform for her organization with complete branding control.

### 👥 **Jordan the Community Manager**

Facilitating cross-platform developer communities and curating educational content.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/plebdevs/frontend.git
cd frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix auto-fixable issues
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript types

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Generate coverage report
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Shadcn/ui base components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── content/           # Content display components
│   ├── auth/              # Authentication components
│   └── admin/             # Admin interface components
├── lib/                   # Utility functions and configurations
│   ├── api/               # API client utilities
│   ├── auth/              # Authentication utilities
│   ├── config/            # Configuration management
│   └── utils/             # General utilities
├── types/                 # TypeScript type definitions
├── data/                  # Mock data and fixtures
├── config/                # JSON configuration files
│   ├── themes/            # Theme configurations
│   ├── components/        # Component styling configs
│   └── platform/          # Platform feature configs
├── hooks/                 # Custom React hooks
├── styles/                # Global styles and Tailwind config
└── docs/                  # Project documentation
    └── phases/            # Development phase documentation
```

## 🎯 Development Phases

### **Phase 1: Setup Foundation** (Week 1)

✅ Next.js project with TypeScript and Tailwind  
✅ Basic routing for all core pages  
✅ Mock data structures matching production schema  
✅ Responsive layout framework

### **Phase 2: MVP Core Features** (Weeks 2-3)

🚧 Mock API layer with realistic data persistence  
🚧 Content discovery with search and filtering  
🚧 User profiles with progress tracking  
🚧 Course progression system

### **Phase 3: Enhanced Features** (Weeks 4-5)

📋 Advanced admin interface with analytics  
📋 JSON-based configuration system  
📋 Multi-platform feeds integration  
📋 PWA capabilities

### **Phase 4: Polish & Optimization** (Week 6)

📋 Performance optimization  
📋 Accessibility compliance (WCAG 2.1 AA)  
📋 Comprehensive testing  
📋 Internationalization framework

### **Phase 5: Enterprise Ready** (Weeks 7-8)

📋 Multi-tenant architecture  
📋 Enterprise security features  
📋 API documentation and SDK  
📋 Migration tools

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our development process and how to submit pull requests.

### Development Guidelines

- **AI-First Codebase**: Code should be clear and well-documented for AI tools
- **File Size Limit**: Maximum 500 lines per file for optimal maintainability
- **Type Safety**: Comprehensive TypeScript coverage required
- **Testing**: Unit tests for all utility functions and critical components
- **Documentation**: JSDoc comments for all functions and components

### Code Style

- **Functional Programming**: Prefer functions over classes
- **Descriptive Naming**: Use clear, descriptive variable and function names
- **Error Handling**: Throw errors instead of returning fallback values
- **Modular Design**: Break complex functionality into smaller, focused modules

## 🛡️ Security & Privacy

- **No User Tracking**: Privacy-first analytics with Vercel Analytics
- **Content Security Policy**: Comprehensive CSP headers for security
- **Accessibility First**: WCAG 2.1 AA compliance throughout
- **Self-Hostable**: Complete control over data and deployment

## 🗺️ Roadmap

### **Immediate Goals**

- [ ] Complete MVP with full content management
- [ ] Implement comprehensive theming system
- [ ] Add PWA capabilities for offline learning

### **Short Term** (Next 3 months)

- [ ] Nostr integration for decentralized content
- [ ] Lightning payment integration
- [ ] Multi-tenant platform support
- [ ] Mobile app development

### **Long Term** (6-12 months)

- [ ] Advanced analytics and AI recommendations
- [ ] Marketplace for educational content
- [ ] Integration with major Lightning wallets
- [ ] Enterprise deployment options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check the `/docs` folder for detailed documentation
- **Issues**: Report bugs and feature requests in GitHub Issues
- **Community**: Join our Discord for community support
- **Contact**: Reach out to the team for enterprise inquiries

---

**Built with ⚡ by the PlebDevs community**

_Empowering developers through decentralized education and Bitcoin-native monetization_
