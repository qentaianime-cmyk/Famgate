/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'animerasaya.serv00.net' }],
  },
  // Prevent scroll restoration jank on refresh
  experimental: { scrollRestoration: false },
}
module.exports = nextConfig
