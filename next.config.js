/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    COLAB_API_URL: process.env.COLAB_API_URL,
  },
}

module.exports = nextConfig
