// apps/web/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 중 ESLint 오류를 무시하도록 설정
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
