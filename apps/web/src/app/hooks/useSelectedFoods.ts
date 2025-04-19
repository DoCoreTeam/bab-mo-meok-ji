// DOCORE: 선호도 선택 - localStorage 저장 + 복구 완성본

import { useEffect, useState } from "react";

export function useSelectedFoods() {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  // --- 컴포넌트 마운트 시 localStorage 복구
  useEffect(() => {
    const saved = localStorage.getItem("selectedFoods");
    if (saved) {
      setSelectedFoods(JSON.parse(saved));
    }
  }, []);

  // --- 음식 선택/해제
  const toggleFood = (food: string) => {
    setSelectedFoods((prev) => {
      let updated: string[];
      if (prev.includes(food)) {
        updated = prev.filter((f) => f !== food);
      } else {
        if (prev.length >= 5) {
          alert("최대 5개까지만 선택할 수 있습니다!");
          return prev;
        }
        updated = [...prev, food];
      }
      localStorage.setItem("selectedFoods", JSON.stringify(updated));
      return updated;
    });
  };

  // --- 전체 초기화
  const resetFoods = () => {
    setSelectedFoods([]);
    localStorage.removeItem("selectedFoods");
  };

  return { selectedFoods, toggleFood, resetFoods };
}
