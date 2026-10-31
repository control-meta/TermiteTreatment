import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  allowedDevOrigins: ['127.0.0.1', '192.168.29.204'],
  images: { unoptimized: true },
  experimental: { useTypeScriptCli: false },
};
export default nextConfig;
