# 🚀 PlebDevs - Next.js 15 Template

A production-ready Next.js 15 template showcasing all the most powerful features of modern web development. Built for developers who want to ship fast with enterprise-grade architecture.

## 🎯 **Project Overview**

**PlebDevs** is a developer education platform template that demonstrates every major Next.js 15 feature in a real-world context. This isn't just another template – it's a comprehensive showcase of modern web development best practices.

### ✨ **Key Features**

- 🔥 **Next.js 15** with React 19 and App Router
- ⚡ **Server Actions** with progressive enhancement
- 🎨 **Advanced Theming** with shadcn/ui and Tailwind CSS v4
- 🌐 **Full-Stack API** routes with TypeScript
- 🔒 **Security-First** with middleware and CSP headers
- 📱 **Responsive Design** with mobile-first approach
- 🚀 **Performance Optimized** with caching and streaming
- 🔍 **SEO Ready** with dynamic metadata generation
- 🎭 **Error Handling** with graceful fallbacks
- 📡 **Real-time Features** ready for WebSocket integration

---

## 🛠️ **Technology Stack**

### **Core Framework**
- **Next.js 15.3.5** - Full-stack React framework
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Turbopack** - Next-generation bundler

### **Styling & UI**
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed components
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful & consistent icons
- **next-themes** - Dark/light mode support

### **Development Tools**
- **ESLint 9** - Code linting and formatting
- **Class Variance Authority** - Component variants
- **clsx & tailwind-merge** - Conditional styling utilities

---

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── courses/       # Course CRUD operations
│   ├── courses/           # Course pages
│   │   ├── [id]/         # Dynamic course details
│   │   └── page.tsx      # Course listing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   ├── loading.tsx        # Global loading UI
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # 404 page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── theme-*.tsx       # Theme-related components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── actions.ts        # Server actions
│   ├── data.ts          # Data fetching utilities
│   ├── utils.ts         # General utilities
│   └── theme-config.ts  # Theme configuration
middleware.ts             # Next.js middleware
next.config.ts           # Next.js configuration
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.17 or later
- npm, yarn, or pnpm

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd no.school

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### **Development Commands**

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🏗️ **Architecture Deep Dive**

### **1. Next.js 15 Features Implemented**

#### **🔥 Server Components & Actions**
- **Server Components** for optimal performance
- **Server Actions** for form handling without API routes
- **Progressive Enhancement** for JavaScript-optional forms

```typescript
// Example Server Action
'use server'
export async function enrollInCourse(formData: FormData) {
  // Validation, processing, and revalidation
  revalidatePath('/courses')
  return { success: true }
}
```

#### **⚡ Advanced Routing**
- **Dynamic Routes** with `[id]` parameters
- **Route Groups** for organized structure
- **Parallel Routes** ready for complex layouts
- **Intercepting Routes** for modals (structure ready)

#### **🎭 Streaming & Suspense**
- **Streaming UI** with React Suspense
- **Loading States** with skeleton components
- **Error Boundaries** for graceful error handling

```tsx
<Suspense fallback={<LoadingSkeleton />}>
  <CourseList />
</Suspense>
```

#### **🔍 SEO & Metadata**
- **Dynamic Metadata** generation
- **OpenGraph & Twitter Cards**
- **JSON-LD structured data** ready

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const course = await getCourseById(params.id)
  return {
    title: `${course.title} - PlebDevs`,
    description: course.description,
    // ... OpenGraph, Twitter, etc.
  }
}
```

### **2. Performance Optimizations**

#### **🚀 Caching Strategy**
- **Next.js Cache API** with `unstable_cache`
- **Multiple Cache Layers** (60s, 5min, 10min)
- **Cache Tags** for targeted revalidation

```typescript
export const getCachedCourses = unstable_cache(
  async () => getCourses(),
  ['courses'],
  { revalidate: 60, tags: ['courses'] }
)
```

#### **🖼️ Image Optimization**
- **next/image** with automatic optimization
- **AVIF & WebP** format support
- **Responsive Images** with proper sizing
- **Blur Placeholders** for better UX

#### **📦 Bundle Optimization**
- **Turbopack** for faster builds
- **Tree Shaking** for smaller bundles
- **Code Splitting** at route level
- **Package Import Optimization**

### **3. Security Implementation**

#### **🔒 Security Headers**
- **Content Security Policy** (CSP)
- **XSS Protection** headers
- **CORS** configuration for API routes
- **Frame Options** for clickjacking protection

#### **🛡️ Middleware Protection**
- **Request/Response** manipulation
- **Route Protection** structure
- **Authentication** middleware ready

---

## 📚 **Component Documentation**

### **Layout Components**

#### **MainLayout**
```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```
Provides consistent header and main content structure.

#### **Section**
```tsx
<Section spacing="lg" className="custom-class">
  <Content />
</Section>
```
Responsive container with consistent spacing.

### **Form Components**

#### **CourseEnrollmentForm**
```tsx
<CourseEnrollmentForm 
  courseId="1" 
  courseTitle="React Fundamentals" 
/>
```
Progressive enhancement form with server actions.

### **Theme Components**

#### **ThemeToggle**
```tsx
<ThemeToggle />
```
Dark/light mode toggle with smooth transitions.

#### **ThemeSelector**
```tsx
<ThemeSelector />
```
Comprehensive theme customization with color, style, and radius options.

---

## 🔌 **API Documentation**

### **Health Check**
```
GET /api/health
```
Returns server health status and version information.

### **Courses API**

#### **Get All Courses**
```
GET /api/courses?category=frontend&page=1&limit=10
```
Supports filtering by category and pagination.

#### **Get Course by ID**
```
GET /api/courses/[id]
```
Returns detailed course information with lessons.

#### **Create Course**
```
POST /api/courses
Content-Type: application/json

{
  "title": "New Course",
  "description": "Course description",
  "category": "frontend"
}
```

#### **Update Course**
```
PUT /api/courses/[id]
```

#### **Delete Course**
```
DELETE /api/courses/[id]
```

---

## 🎨 **Theming System**

### **Built-in Themes**
- **Colors**: Neutral, Stone, Slate, Gray, Zinc, Red, Orange, Yellow, Green, Blue, Indigo, Violet, Purple, Pink, Rose
- **Styles**: Default, New York
- **Radius**: None, Small, Medium, Large, Extra Large

### **Custom Theme Creation**
```typescript
// lib/theme-config.ts
export const customTheme: ThemeConfig = {
  value: 'custom',
  label: 'Custom Theme',
  colors: {
    light: { /* light mode colors */ },
    dark: { /* dark mode colors */ }
  }
}
```

---

## 📈 **Performance Metrics**

### **Core Web Vitals Optimizations**
- **LCP**: Optimized with next/image and font loading
- **FID**: Minimized with proper code splitting
- **CLS**: Prevented with skeleton loaders
- **TTFB**: Improved with caching strategies

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Docker**
```dockerfile
# Dockerfile included for containerized deployment
docker build -t plebdevs .
docker run -p 3000:3000 plebdevs
```

### **Environment Variables**
```env
# .env.local
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=your-database-url
```

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Style**
- **ESLint** configuration enforced
- **TypeScript** strict mode enabled
- **Prettier** formatting (configure as needed)
- **Functional components** preferred over classes

---

## 📖 **Learning Resources**

### **Next.js 15 Features**
- [Next.js Documentation](https://nextjs.org/docs)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

### **React 19 Features**
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Server Components](https://react.dev/reference/react/use-server)
- [Suspense & Streaming](https://react.dev/reference/react/Suspense)

---

## 🎯 **What's Next?**

### **Ready for Integration**
- **Database**: Prisma/Drizzle ORM integration
- **Authentication**: NextAuth.js or Clerk
- **Payments**: Stripe integration
- **Real-time**: WebSocket support
- **CMS**: Headless CMS integration

### **Advanced Features**
- **Internationalization** (i18n)
- **Progressive Web App** (PWA)
- **Edge Functions** for global performance
- **Analytics** integration

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Vercel** for Next.js and deployment platform
- **shadcn** for the beautiful UI components
- **Tailwind CSS** for the utility-first approach
- **Radix UI** for accessible component primitives

---

**Built with 💜 by PlebDevs**

*Ready to build the next generation of web applications? This template gives you everything you need to ship fast and scale efficiently.*
