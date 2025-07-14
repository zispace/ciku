import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 启用静态导出
  basePath: '/ciku',         // 二级目录
  assetPrefix: '/ciku/',     // 静态资源前缀
};

export default nextConfig;
