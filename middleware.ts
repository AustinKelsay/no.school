/**
 * Next.js Middleware
 * 
 * This middleware handles:
 * - Security headers
 * - CORS for API routes
 * - Basic routing (NextAuth handles its own auth routes)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add CSP header for enhanced security
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // In development, allow unsafe directives for Turbopack hot reloading
  // In production, remove unsafe directives for better security
  const scriptSrc = isDevelopment 
    ? "'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live"
    : "'self' https://vercel.live"
    
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://avatars.githubusercontent.com https://api.dicebear.com https://i.ytimg.com https://yt3.ggpht.com https://nyc3.digitaloceanspaces.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://vitals.vercel-insights.com wss://relay.nostr.band wss://nos.lol wss://relay.damus.io;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)

  // Handle API routes with environment-aware CORS
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Configure CORS based on environment
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://127.0.0.1:3000'] // Development defaults
    
    const origin = request.headers.get('origin')
    const isAllowedOrigin = !origin || allowedOrigins.includes(origin)
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 