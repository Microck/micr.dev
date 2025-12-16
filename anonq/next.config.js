/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  basePath: process.env.NODE_ENV === 'production' ? '/anonq' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/anonq' : '',
}

module.exports = nextConfig
