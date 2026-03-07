/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  turbopack: {},
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Turbopack config removed to prevent build crash
  
  // REMOVED: output: 'export' — API Routes require server mode
  // REMOVED: distDir: 'dist' — use default .next
  
  // Enable image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.oro.finance',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://oro-tradebook-mainnet.up.railway.app https://oro-tradebook-devnet.up.railway.app https://api.devnet.solana.com https://api.mainnet-beta.solana.com wss://api.devnet.solana.com wss://api.mainnet-beta.solana.com https://*.helius-rpc.com https://*.quicknode.com https://*.alchemy.com; frame-src 'self' https://phantom.app https://solflare.com https://*.phantom.app https://*.solflare.com; object-src 'none'; base-uri 'self'; form-action 'self'"
          },
        ],
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle Solana web3.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
