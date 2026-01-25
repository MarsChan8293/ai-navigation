/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  // 图片优化配置
  images: {
    // 禁用 Next.js 图片优化，允许所有外部图片直接加载
    unoptimized: true,
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
