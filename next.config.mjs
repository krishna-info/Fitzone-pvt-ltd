/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  transpilePackages: ['react-leaflet', 'leaflet'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: "https",
        hostname: "6bcd0d833873d083feeeaab886a8cc8a.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-c2f493365c1443249039e863c4f1a5e3.r2.dev",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['fitzoneapparels.com', 'www.fitzoneapparels.com', 'localhost:3000'],
    },
  },
};

export default nextConfig;
