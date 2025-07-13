/**
 * @fileoverview UI component and interface TypeScript types
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { ReactNode, MouseEvent, ChangeEvent, FormEvent } from 'react';
import type { User } from './auth';
import type { Course, Resource, Draft, UserProgress } from './content';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Layout component types
export interface PageLayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  requireAuth?: boolean;
}

export interface HeaderProps extends BaseComponentProps {
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  showSearchBar?: boolean;
}

export interface FooterProps extends BaseComponentProps {
  showSocialLinks?: boolean;
  showNewsletterSignup?: boolean;
}

export interface SidebarProps extends BaseComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: User | null;
}

// Content component types
export interface ContentCardProps extends BaseComponentProps {
  type: 'course' | 'resource' | 'video' | 'document';
  title: string;
  summary: string;
  image?: string;
  price?: number;
  topics: string[];
  author: User;
  createdAt: Date;
  progress?: number;
  isPurchased?: boolean;
  onClick?: () => void;
  onPurchase?: () => void;
  onZap?: (amount: number) => void;
  showActions?: boolean;
}

export interface CourseCardProps extends BaseComponentProps {
  course: Course & { user: User; lessons: unknown[]; badge?: unknown };
  showPurchaseButton?: boolean;
  showZapButton?: boolean;
  currentUserId?: string;
  onCourseClick?: (courseId: string) => void;
  onPurchaseClick?: (courseId: string) => void;
  onZapClick?: (courseId: string, amount: number) => void;
}

export interface ContentGridProps extends BaseComponentProps {
  content: ContentCardProps[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  emptyMessage?: string;
}

export interface ContentCarouselProps extends BaseComponentProps {
  title: string;
  content: ContentCardProps[];
  showViewAll?: boolean;
  onViewAll?: () => void;
}

// Form component types
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string | number | boolean;
  onChange?: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  options?: Array<{ value: string; label: string }>;
}

export interface SearchBarProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  suggestions?: string[];
  loading?: boolean;
}

export interface FiltersPanelProps extends BaseComponentProps {
  filters: {
    topics: string[];
    priceRange: { min: number; max: number };
    difficulty: string[];
    contentType: string[];
  };
  availableTopics: string[];
  onFiltersChange: (filters: FiltersPanelProps['filters']) => void;
  onReset: () => void;
}

// Authentication component types
export interface LoginModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    provider: string,
    credentials?: Record<string, unknown>,
  ) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export interface SignupFormProps extends BaseComponentProps {
  onSignup: (data: SignupFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export interface SignupFormData {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  provider: 'email' | 'nostr' | 'github' | 'anonymous';
  pubkey?: string;
  termsAccepted: boolean;
}

export interface ProfileFormProps extends BaseComponentProps {
  user: User;
  onUpdate: (updates: Partial<User>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

// Admin component types
export interface AdminDashboardProps extends BaseComponentProps {
  stats: {
    totalCourses: number;
    totalUsers: number;
    totalRevenue: number;
    activeSubscriptions: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'course_created' | 'user_registered' | 'purchase_made';
    description: string;
    timestamp: Date;
  }>;
}

export interface ContentEditorProps extends BaseComponentProps {
  type: 'course' | 'resource' | 'draft';
  initialContent?: Draft | Course | Resource;
  onSave: (content: Draft | Course | Resource) => Promise<void>;
  onPreview: (content: Draft | Course | Resource) => void;
  onPublish?: (content: Draft | Course | Resource) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export interface ThemeEditorProps extends BaseComponentProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onSave: (theme: ThemeConfig) => Promise<void>;
  onReset: () => void;
  previewMode?: boolean;
}

// Progress and analytics component types
export interface ProgressBarProps extends BaseComponentProps {
  progress: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressDashboardProps extends BaseComponentProps {
  userProgress: UserProgress;
  courses: Course[];
  onContinueCourse: (courseId: string) => void;
  onStartCourse: (courseId: string) => void;
}

export interface AnalyticsChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  title?: string;
  description?: string;
  height?: number;
}

// Modal and dialog types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ConfirmDialogProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}

// Navigation component types
export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  currentPath: string;
  variant?: 'header' | 'sidebar' | 'footer';
  orientation?: 'horizontal' | 'vertical';
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  requiredRole?: string;
  external?: boolean;
}

// Button and action component types
export interface ButtonProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'bitcoin'
    | 'lightning';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface ActionMenuProps extends BaseComponentProps {
  trigger: ReactNode;
  items: ActionMenuItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick: () => void;
}

// Notification and feedback types
export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  text?: string;
}

export interface EmptyStateProps extends BaseComponentProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme and configuration types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontScale: string;
    lineHeight: string;
  };
  spacing: {
    scale: string;
    componentBase: string;
    layoutBase: string;
  };
  components: {
    buttons: {
      borderRadius: string;
      padding: string;
    };
    cards: {
      borderRadius: string;
      padding: string;
    };
    [key: string]: Record<string, string>;
  };
}

export interface ComponentVariantConfig {
  [componentName: string]: {
    variants: {
      [variantName: string]: Record<string, string>;
    };
    defaultVariant?: string;
  };
}

// Event handler types
export type ClickHandler = (event: MouseEvent) => void;
export type ChangeHandler = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;
export type SubmitHandler = (event: FormEvent) => void;
export type KeyboardHandler = (event: KeyboardEvent) => void;

// Responsive breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Animation and transition types
export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export type TransitionType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';
