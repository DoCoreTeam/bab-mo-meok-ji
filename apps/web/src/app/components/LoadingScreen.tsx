// DOCORE: 2025-04-20 13:10 추천 중 로딩 화면 컴포넌트

"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <p className="text-center text-lg font-semibold mb-4">
        🍽️ 맛집 추천 중입니다...
      </p>
      <div className="h-12 w-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
}
