/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  // 图片优化配置
  images: {
    // 启用现代图片格式支持
    formats: ['image/avif', 'image/webp'],
    // 启用图片缓存
    minimumCacheTTL: 60,
    // 配置外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // 禁用未优化提示
    unoptimized: false,
  },
  // 性能优化配置
  compress: true,
  // 启用React Strict Mode
  reactStrictMode: true,
  // 配置CDN路径（如果有的话）
  // assetPrefix: process.env.CDN_URL,
  // 配置HTTP缓存头
  headers: async () => [
    // 安全头配置
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
    // 静态资源缓存策略
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // 图片资源缓存策略
    {
      source: '/_next/image/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400',
        },
      ],
    },
    // API响应缓存策略
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, stale-while-revalidate=600',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
