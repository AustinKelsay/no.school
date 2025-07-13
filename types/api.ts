/**
 * @fileoverview API response and request TypeScript interfaces
 * @author PlebDevs Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Generic API response wrapper
export interface APIResponse<T = unknown> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Paginated response wrapper
export interface PaginatedResponse<T = unknown> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API error types
export interface APIError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends APIError {
  code: 'VALIDATION_ERROR';
  field: string;
  value?: unknown;
}

export interface AuthenticationError extends APIError {
  code: 'AUTHENTICATION_ERROR';
  message: 'Authentication required' | 'Invalid credentials' | 'Token expired';
}

export interface AuthorizationError extends APIError {
  code: 'AUTHORIZATION_ERROR';
  message: 'Insufficient permissions' | 'Access denied';
}

export interface NotFoundError extends APIError {
  code: 'NOT_FOUND';
  resource: string;
  resourceId?: string;
}

export interface ConflictError extends APIError {
  code: 'CONFLICT';
  message: string;
  conflictingField?: string;
}

export interface RateLimitError extends APIError {
  code: 'RATE_LIMIT_EXCEEDED';
  retryAfter: number;
  limit: number;
}

// Request pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search parameters
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}

// API endpoints types
export interface APIEndpoints {
  // Authentication
  '/api/auth/login': {
    POST: {
      body: {
        provider: string;
        credentials?: Record<string, unknown>;
      };
      response: APIResponse<{
        user: import('./auth').User;
        session: import('./auth').Session;
      }>;
    };
  };

  '/api/auth/logout': {
    POST: {
      response: APIResponse<{ success: boolean }>;
    };
  };

  '/api/auth/me': {
    GET: {
      response: APIResponse<import('./auth').User>;
    };
  };

  // Courses
  '/api/courses': {
    GET: {
      params?: SearchParams & {
        userId?: string;
        includeDetails?: boolean;
      };
      response: APIResponse<
        PaginatedResponse<
          import('./content').Course | import('./content').CourseWithDetails
        >
      >;
    };
    POST: {
      body: import('./content').CreateCourseRequest;
      response: APIResponse<import('./content').Course>;
    };
  };

  '/api/courses/[id]': {
    GET: {
      params: { id: string };
      query?: { includeDetails?: boolean };
      response: APIResponse<
        import('./content').Course | import('./content').CourseWithDetails
      >;
    };
    PUT: {
      params: { id: string };
      body: Partial<import('./content').CreateCourseRequest>;
      response: APIResponse<import('./content').Course>;
    };
    DELETE: {
      params: { id: string };
      response: APIResponse<{ success: boolean }>;
    };
  };

  '/api/courses/[id]/enroll': {
    POST: {
      params: { id: string };
      body: { userId: string };
      response: APIResponse<import('./content').UserCourse>;
    };
  };

  '/api/courses/[id]/progress': {
    PUT: {
      params: { id: string };
      body: {
        userId: string;
        completed?: boolean;
        submittedRepoLink?: string;
      };
      response: APIResponse<import('./content').UserCourse>;
    };
  };

  '/api/courses/[id]/purchase': {
    POST: {
      params: { id: string };
      body: {
        userId: string;
        amountPaid: number;
        paymentHash?: string;
      };
      response: APIResponse<import('./content').Purchase>;
    };
  };

  // Resources
  '/api/resources': {
    GET: {
      params?: SearchParams & {
        userId?: string;
        includeDetails?: boolean;
      };
      response: APIResponse<
        PaginatedResponse<
          import('./content').Resource | import('./content').ResourceWithDetails
        >
      >;
    };
    POST: {
      body: import('./content').CreateResourceRequest;
      response: APIResponse<import('./content').Resource>;
    };
  };

  '/api/resources/[id]': {
    GET: {
      params: { id: string };
      query?: { includeDetails?: boolean };
      response: APIResponse<
        import('./content').Resource | import('./content').ResourceWithDetails
      >;
    };
    PUT: {
      params: { id: string };
      body: Partial<import('./content').CreateResourceRequest>;
      response: APIResponse<import('./content').Resource>;
    };
    DELETE: {
      params: { id: string };
      response: APIResponse<{ success: boolean }>;
    };
  };

  // Drafts
  '/api/drafts': {
    GET: {
      params?: SearchParams & { userId?: string };
      response: APIResponse<PaginatedResponse<import('./content').Draft>>;
    };
    POST: {
      body: import('./content').CreateDraftRequest;
      response: APIResponse<import('./content').Draft>;
    };
  };

  '/api/drafts/[id]': {
    GET: {
      params: { id: string };
      response: APIResponse<import('./content').Draft>;
    };
    PUT: {
      params: { id: string };
      body: Partial<import('./content').CreateDraftRequest>;
      response: APIResponse<import('./content').Draft>;
    };
    DELETE: {
      params: { id: string };
      response: APIResponse<{ success: boolean }>;
    };
  };

  '/api/drafts/[id]/publish': {
    POST: {
      params: { id: string };
      response: APIResponse<
        import('./content').Course | import('./content').Resource
      >;
    };
  };

  // Course Drafts
  '/api/course-drafts': {
    GET: {
      params?: SearchParams & { userId?: string };
      response: APIResponse<PaginatedResponse<import('./content').CourseDraft>>;
    };
    POST: {
      body: Omit<
        import('./content').CourseDraft,
        'id' | 'createdAt' | 'updatedAt'
      >;
      response: APIResponse<import('./content').CourseDraft>;
    };
  };

  '/api/course-drafts/[id]': {
    GET: {
      params: { id: string };
      response: APIResponse<import('./content').CourseDraft>;
    };
    PUT: {
      params: { id: string };
      body: Partial<
        Omit<
          import('./content').CourseDraft,
          'id' | 'userId' | 'createdAt' | 'updatedAt'
        >
      >;
      response: APIResponse<import('./content').CourseDraft>;
    };
    DELETE: {
      params: { id: string };
      response: APIResponse<{ success: boolean }>;
    };
  };

  '/api/course-drafts/[id]/publish': {
    POST: {
      params: { id: string };
      response: APIResponse<import('./content').Course>;
    };
  };

  // Users
  '/api/users/[id]': {
    GET: {
      params: { id: string };
      query?: { includeDetails?: boolean };
      response: APIResponse<
        import('./auth').User | import('./auth').UserWithDetails
      >;
    };
    PUT: {
      params: { id: string };
      body: Partial<
        Pick<import('./auth').User, 'username' | 'avatar' | 'email'>
      >;
      response: APIResponse<import('./auth').User>;
    };
  };

  '/api/users/[id]/progress': {
    GET: {
      params: { id: string };
      response: APIResponse<import('./content').UserProgress>;
    };
  };

  // Platform services
  '/api/platform/nip05': {
    POST: {
      body: {
        userId: string;
        pubkey: string;
        name: string;
      };
      response: APIResponse<import('./auth').PlatformNip05>;
    };
  };

  '/api/platform/nip05/availability': {
    GET: {
      query: { name: string };
      response: APIResponse<{ available: boolean }>;
    };
  };

  '/api/platform/lightning-address': {
    POST: {
      body: {
        userId: string;
        name: string;
        invoiceMacaroon: string;
        lndHost: string;
        lndPort?: string;
        lndCert?: string;
      };
      response: APIResponse<import('./auth').PlatformLightningAddress>;
    };
  };
}

// Helper types for API routes
export type APIMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type APIRouteConfig<T = unknown> = {
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: T;
  response: APIResponse<unknown>;
};

// Request/Response extraction helpers
export type ExtractAPIParams<
  T extends keyof APIEndpoints,
  M extends keyof APIEndpoints[T],
> = APIEndpoints[T][M] extends { params: infer P } ? P : never;

export type ExtractAPIQuery<
  T extends keyof APIEndpoints,
  M extends keyof APIEndpoints[T],
> = APIEndpoints[T][M] extends { query: infer Q } ? Q : never;

export type ExtractAPIBody<
  T extends keyof APIEndpoints,
  M extends keyof APIEndpoints[T],
> = APIEndpoints[T][M] extends { body: infer B } ? B : never;

export type ExtractAPIResponse<
  T extends keyof APIEndpoints,
  M extends keyof APIEndpoints[T],
> = APIEndpoints[T][M] extends { response: APIResponse<infer R> } ? R : never;
