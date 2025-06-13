// Full Code for: next.config.mjs (Simplified for new local server)

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/wave',
  compiler: {
    forceSwcTransforms: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/wave/api/:path*',
          // --- THE CHANGE IS HERE ---
          // We now point directly to the PHP server's root.
          destination: 'http://localhost:8080/:path*', 
        },
      ];
    }
    return [];
  },
};

export default nextConfig;