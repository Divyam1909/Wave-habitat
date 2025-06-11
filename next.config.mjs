/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/wave-habitat',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
