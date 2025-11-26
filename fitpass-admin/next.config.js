/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: 'loose'
  },
  // Disable prerendering for problematic pages
  async generateStaticParams() {
    return []
  },
  // Skip build-time static generation
  generateBuildId: () => 'fitpass-admin-spa'
}

module.exports = nextConfig