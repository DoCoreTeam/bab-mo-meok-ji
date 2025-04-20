// DOCORE: 2025-04-20 14:55 AI가 추천한 추가 음식에 대해 좋아요/싫어요 선택 화면 컴포넌트

"use client";

import React from "react";

interface AiAdditionalFoodsProps {
  aiFoods: string[];               // AI가 추천한 음식 이름 배열
  onAccept: () => void;             // 좋아요 눌렀을 때 호출
  onReject: () => void;             // 싫어요 눌렀을 때 호출
}

export default function AiAdditionalFoods({
  aiFoods,
  onAccept,
  onReject,
}: AiAdditionalFoodsProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow transition-colors flex flex-col items-center space-y-6">
      <h2 className="text-center text-2xl font-bold">🤖 AI가 이런 음식도 추천했어요!</h2>

      <div className="flex flex-col items-center space-y-2">
        {aiFoods.map((food, idx) => (
          <div key={idx} className="text-lg font-semibold">
            {food}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform active:scale-95"
          onClick={onAccept}
        >
          좋아요 👍 (추가 포함)
        </button>
        <button
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform active:scale-95"
          onClick={onReject}
        >
          싫어요 👎 (제외)
        </button>
      </div>
    </div>
  );
}
