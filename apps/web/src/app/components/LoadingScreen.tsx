// DOCORE: 2025-04-20 15:00 맛집 추천 검색 중 표시하는 로딩 화면 컴포넌트

"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    // <div className="w-full h-full flex flex-col items-center justify-center p-6">
    //   <p className="text-center text-lg font-semibold mb-4">
    //     🔍 맛집을 열심히 찾고 있어요...
    //   </p>
    //   <div className="h-12 w-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
    // </div>
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-black space-y-4">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
    <p className="text-gray-600 text-sm">AI가 당신에게 어울리는 메뉴를 고민하고 있어요...</p>
  </div>
    
  );
}
