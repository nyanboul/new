/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['rndmoyifjwtuxlvspevo.supabase.co'],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: false,
  },
  webpack: (config, { dev, isServer }) => {
    config.stats = config.stats || {};
    config.stats.errors = true;
    config.stats.errorDetails = true;
    return config;
  },
}

module.exports = nextConfig 
