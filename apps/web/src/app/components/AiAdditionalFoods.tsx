// DOCORE: 2025-04-20 15:15 AI가 추천한 음식도 CategoryButton 스타일로 보여주는 컴포넌트

"use client";

import React from "react";


// DOCORE: 2025-04-21 10:30 AI 추천 음식 화면 리뉴얼 최종 적용
export default function AiAdditionalFoods({
  aiFoods,
  onAccept,
  onReject,
}: {
  aiFoods: string[];
  onAccept: () => void;
  onReject: () => void;
}) {
  if (aiFoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg font-semibold">추천할 음식이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">🤖 AI 추천 음식</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm mb-8">
        <p className="text-xl font-semibold text-gray-800">{aiFoods[0]}</p>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button
          onClick={onAccept}
          className="flex-1 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition transform active:scale-95"
        >
          좋아요 👍
        </button>
        <button
          onClick={onReject}
          className="flex-1 py-3 rounded-xl bg-gray-300 text-gray-700 hover:bg-gray-400 transition transform active:scale-95"
        >
          다른 거 추천 👎
        </button>
      </div>
    </div>
  );
}
