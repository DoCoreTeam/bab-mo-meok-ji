// apps/web/src/app/components/SelectFavoriteFoods.tsx

"use client";

import { Category } from "@/app/page";

interface SelectFavoriteFoodsProps {
  categories: Category[];
  selectedFoods: string[];
  onToggleFood: (food: string) => void;
  onNext: () => void;
  onRefresh: () => void; // ✨ 추가
  typeLabel: string;
}

export default function SelectFavoriteFoods({
  categories,
  selectedFoods,
  onToggleFood,
  onNext,
  onRefresh, // ✨ 추가
  typeLabel,
}: SelectFavoriteFoodsProps) {
  if (categories.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg font-semibold mb-4">{typeLabel}</p>
        <p className="text-gray-600 animate-pulse">AI가 음식 카테고리를 추천하고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <p className="text-center mb-2 text-lg font-semibold">{typeLabel}</p>
      <p className="text-center mb-4 text-gray-700">좋아하는 음식을 최대 5개 선택하세요!</p>

      {/* 음식 리스트 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-lg border ${
              selectedFoods.includes(cat.eng_keyword)
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onToggleFood(cat.eng_keyword)}
          >
            {cat.kor_name}
          </button>
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform active:scale-95 active:opacity-80"
        >
          선택 완료
        </button>

        <button
          onClick={onRefresh} // ✨ 새로고침 버튼
          className="w-full py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition transform active:scale-95 active:opacity-80"
        >
          🔄 다른 음식 추천받기
        </button>
      </div>
    </div>
  );
}
