/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1', '192.168.29.204'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
