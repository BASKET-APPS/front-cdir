import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: 'export',
  basePath: '/front-cdir',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
