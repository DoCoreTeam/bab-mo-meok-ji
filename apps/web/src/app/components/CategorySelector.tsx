// // src/app/components/CategorySelector.tsx
// "use client";

// import { Category } from "@/types/Place";

// interface CategorySelectorProps {
//   categories: Category[];
//   selectedFoods: string[];
//   setSelectedFoods: (foods: string[]) => void;
//   saveSelectedFoods: () => void;
//   handleStartRecommendation: () => void;
// }

// export default function CategorySelector({
//   categories,
//   selectedFoods,
//   setSelectedFoods,
//   saveSelectedFoods,
//   handleStartRecommendation,
// }: CategorySelectorProps) {
//   const handleToggle = (food: string) => {
//     if (selectedFoods.includes(food)) {
//       setSelectedFoods(selectedFoods.filter((f) => f !== food));
//     } else {
//       if (selectedFoods.length >= 5) return;
//       setSelectedFoods([...selectedFoods, food]);
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       <p className="text-center mb-4">좋아하는 음식을 선택하세요 (최대 5개)</p>
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             className={`p-3 rounded-xl ${selectedFoods.includes(cat.kor_name) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
//             onClick={() => handleToggle(cat.kor_name)}
//           >
//             {cat.kor_name}
//           </button>
//         ))}
//       </div>
//       <button
//         className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
//         onClick={() => {
//           saveSelectedFoods();
//           handleStartRecommendation();
//         }}
//       >
//         추천 시작
//       </button>
//     </div>
//   );
// }

// src/app/components/CategorySelector.tsx
"use client";

import { Category } from "@/types/Place";
import { useMemo } from "react";

interface CategorySelectorProps {
  categories: Category[];
  selectedFoods: string[];
  setSelectedFoods: (foods: string[]) => void;
  saveSelectedFoods: () => void;
  handleStartRecommendation: () => void;
}

export default function CategorySelector({
  categories,
  selectedFoods,
  setSelectedFoods,
  saveSelectedFoods,
  handleStartRecommendation,
}: CategorySelectorProps) {
  // ✅ 여기 추가
  const shuffledCategories = useMemo(() => {
    return [...categories]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  }, [categories]);

  const handleToggle = (food: string) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== food));
    } else {
      if (selectedFoods.length >= 5) return;
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="text-center mb-4">좋아하는 음식을 선택하세요 (최대 5개)</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/** ✅ 여기 바꿔야 해 */}
        {shuffledCategories.map((cat) => (
          <button
            key={cat.id}
            className={`p-3 rounded-xl ${
              selectedFoods.includes(cat.kor_name)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleToggle(cat.kor_name)}
          >
            {cat.kor_name}
          </button>
        ))}
      </div>
      <button
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        onClick={() => {
          saveSelectedFoods();
          handleStartRecommendation();
        }}
      >
        추천 시작
      </button>
    </div>
  );
}
