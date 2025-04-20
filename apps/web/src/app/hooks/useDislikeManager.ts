// DOCORE: 2025-04-20 15:05 싫어요 누른 음식을 localStorage에 저장해서 7일간 다시 추천하지 않게 관리하는 커스텀 훅

"use client";

import { useCallback } from "react";

const DISLIKE_KEY = "dislikedFoods"; // localStorage 키 이름

export function useDislikeManager() {
  // DOCORE: 2025-04-20 15:05 싫어요 누른 음식 저장
  const saveDislikedFood = useCallback((food: string) => {
    const dislikes = JSON.parse(localStorage.getItem(DISLIKE_KEY) || "{}");
    dislikes[food] = Date.now();
    localStorage.setItem(DISLIKE_KEY, JSON.stringify(dislikes));
  }, []);

  // DOCORE: 2025-04-20 15:05 특정 음식이 최근 7일 이내 싫어요인지 체크
  const isFoodDisliked = useCallback((food: string) => {
    const dislikes = JSON.parse(localStorage.getItem(DISLIKE_KEY) || "{}");
    const timestamp = dislikes[food];
    if (!timestamp) return false;

    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7일
    return now - timestamp < oneWeek;
  }, []);

  

  return {
    saveDislikedFood,
    isFoodDisliked,
  };
}

// ✅ 여기 추가
if (typeof window !== "undefined") {
    window.printDislikedFoods = () => {
      const raw = localStorage.getItem("dislikedFoods") || "{}";
      const dislikes = JSON.parse(raw);
  
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
      const validDislikes = Object.entries(dislikes)
        .filter(([_, timestamp]) => typeof timestamp === "number" && now - timestamp < oneWeek)
        .map(([food]) => food);
  
      console.table(validDislikes);
    };
  }