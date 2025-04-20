// DOCORE: 2025-04-20 15:15 AI가 추천한 음식도 CategoryButton 스타일로 보여주는 컴포넌트

"use client";

import React from "react";
import { CategoryButton } from "@/app/components/CategoryButton";

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
    <div className="w-full max-w-md mx-auto p-4 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow transition-colors flex flex-col items-center">
      <h2 className="text-center text-2xl font-bold mb-6">
        🤖 AI가 이런 음식도 추천했어요!
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {aiFoods.map((food, idx) => (
          <CategoryButton
            key={idx}
            label={food}
            selected={false}
            onClick={() => {}}
          />
        ))}
      </div>

      <div className="flex space-x-4">
        
        <button
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition transform active:scale-95 active:opacity-80"
        onClick={onAccept}
        >
        좋아요 👍
        </button>

        <button
        className="w-full py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition transform active:scale-95 active:opacity-80"
        onClick={onReject}
        >
        싫어요 👎
        </button>

      </div>
    </div>
  );
}
