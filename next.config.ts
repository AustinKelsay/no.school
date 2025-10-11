import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure problematic node_modules packages are transpiled and resolved correctly
  transpilePackages: ["snstr"],
  // Enable experimental features for better performance
  experimental: {
    // optimizePackageImports disabled to avoid server vendor chunk using web runtime
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization configuration
  images: {
    // Common image domains you might use
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
    // Optimize images for better performance
    formats: ['image/avif', 'image/webp'],
    // Enable blur placeholder for better UX
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  compress: true,
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack configuration for optimal bundling
  webpack: (config, { isServer }) => {
    // Do not override Next's splitChunks; custom vendor chunk can break server runtime

    // Only apply browser fallbacks on the client build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        child_process: false,
      };
    }

    // Ensure no legacy deep alias for snstr remains; rely on package exports
    if (config.resolve.alias && (config.resolve.alias as any).snstr) {
      delete (config.resolve.alias as any).snstr;
    }

    return config;
  },
};

export default nextConfig;
