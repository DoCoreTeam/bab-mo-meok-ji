// apps/web/.eslintrc.js

/**
 * ESLint 설정: no-explicit-any, no-unused-vars, prefer-const 에러 무시
 */
module.exports = {
    root: true,
    extends: [
      'next',
      'next/core-web-vitals'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'off'
    }
  };
  