/** @type {import('next').NextConfig} */
const basePath = '/anonq'

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

module.exports = nextConfig
