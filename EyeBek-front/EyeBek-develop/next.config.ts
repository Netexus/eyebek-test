/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/backend/:path*',
          destination: 'https://eyebek-1.onrender.com/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;