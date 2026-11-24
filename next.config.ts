import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: process.env.CDIR_BUILD_CPUS === '1' ? {cpus: 1} : undefined,
  output: 'export',
  basePath: '/front-cdir',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
