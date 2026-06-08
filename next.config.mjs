/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 管理操作のレスポンスにキャッシュを残さない等、必要な調整はここに集約する
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
