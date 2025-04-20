// DOCORE: 2025-04-20 14:50 사용자가 기본 선호 음식을 선택하는 화면 컴포넌트

"use client";

import React from "react";
import { CategoryButton } from "@/app/components/CategoryButton";

interface Category {
  id: number;
  kor_name: string;
  eng_keyword: string;
  icon_url?: string;
  description?: string;
}

interface SelectFavoriteFoodsProps {
  categories: Category[];           // DB에서 가져온 음식 카테고리
  selectedFoods: string[];           // 현재 선택된 음식 키워드 목록
  onToggleFood: (food: string) => void; // 음식 선택/해제 핸들러
  onNext: () => void;                // "선택 완료" 버튼 눌렀을 때 핸들러
}

export default function SelectFavoriteFoods({
  categories,
  selectedFoods,
  onToggleFood,
  onNext,
}: SelectFavoriteFoodsProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow transition-colors">
      <h2 className="text-center text-2xl font-bold mb-2">오늘은 어떤 음식을?</h2>
      <p className="text-center mb-4 text-base">최대 5개까지 선택할 수 있어요!</p>

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

      <button
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform active:scale-95 active:opacity-80"
        onClick={onNext}
        disabled={selectedFoods.length === 0}
      >
        선택 완료
      </button>
    </div>
  );
}
