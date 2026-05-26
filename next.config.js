/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'animerasaya.serv00.net',
      },
    ],
  },
}

module.exports = nextConfig
