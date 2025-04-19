/**
 * apps/web/tailwind.config.js
 *
 * Tailwind CSS 설정 파일이 없으므로 새로 생성합니다.
 * 다크 모드를 OS/브라우저 설정에 따라 자동 적용하도록 media 전략 사용
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'media', // 다크 모드를 prefers-color-scheme에 따라 자동 적용
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {}
    },
    plugins: []
  };
  