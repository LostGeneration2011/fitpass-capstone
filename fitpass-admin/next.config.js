/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  compiler: {
    styledComponents: true,
  },
  // Disable static generation for error pages to avoid SSR issues
  async generateBuildId() {
    return 'fitpass-admin-build'
  },
}

module.exports = nextConfig