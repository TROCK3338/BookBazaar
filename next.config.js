/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  trailingSlash: false,
  
  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'example.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Headers for security
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
}

module.exports = nextConfig
