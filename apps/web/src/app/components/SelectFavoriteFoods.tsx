// DOCORE: 2025-04-20 13:00 사용자가 선호 음식을 선택하는 화면 컴포넌트

"use client";

import React from "react";
import { CategoryButton } from "@/app/components/CategoryButton"; // 이미 기존에 사용 중이던 버튼

interface SelectFavoriteFoodsProps {
  categories: {
    id: number;
    kor_name: string;
    eng_keyword: string;
  }[];
  selectedFoods: string[];
  onToggleFood: (food: string) => void;
  onStartRecommendation: () => void;
  isStarting: boolean;
  typeLabel: string;
}

export default function SelectFavoriteFoods({
  categories,
  selectedFoods,
  onToggleFood,
  onStartRecommendation,
  isStarting,
  typeLabel,
}: SelectFavoriteFoodsProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-[var(--background)] text-[var(--foreground)] p-4 rounded-lg shadow transition-colors">
      <p className="text-center text-xl font-semibold mb-2">
        오늘은 뭐 먹을거예요? (구글 별점 3 이상 추천)
      </p>
      <p className="text-center mb-2 text-lg font-semibold">{typeLabel}</p>
      <p className="text-center mb-4">좋아하는 음식을 선택하세요 (최대 5개)</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map(cat => (
          <CategoryButton
            key={cat.id}
            label={cat.kor_name}
            selected={selectedFoods.includes(cat.eng_keyword)}
            onClick={() => onToggleFood(cat.eng_keyword)}
          />
        ))}
      </div>

      {isStarting ? (
        <div className="flex justify-center py-3">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <button
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform active:scale-95 active:opacity-80"
          onClick={onStartRecommendation}
        >
          추천 시작
        </button>
      )}
    </div>
  );
}
