// DOCORE: 2025-04-20 15:50 SelectFavoriteFoods 컴포넌트 (typeLabel 추가 반영)

"use client";

import { Category } from "@/app/page";
import { CategoryButton } from "@/app/components/CategoryButton";

interface SelectFavoriteFoodsProps {
  categories: Category[];
  selectedFoods: string[];
  onToggleFood: (food: string) => void;
  onNext: () => Promise<void>;
  typeLabel: string; // ✅ 추가: 어떤 타입(식사/간식/술안주) 추천 중인지 표시
}

export default function SelectFavoriteFoods({
  categories,
  selectedFoods,
  onToggleFood,
  onNext,
  typeLabel,
}: SelectFavoriteFoodsProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow transition-colors flex flex-col items-center">
      {/* ✅ 타입별 추천 문구 표시 */}
      <h2 className="text-center text-lg font-semibold mb-2">{typeLabel}</h2>
      
      <p className="text-center text-xl font-bold mb-2">오늘은 뭐 먹을까요? (구글 별점 3 이상 추천)</p>
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

      <button
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform active:scale-95 active:opacity-80"
        onClick={onNext}
      >
        선택 완료
      </button>
    </div>
  );
}
