// DOCORE: 2025-04-20 13:20 싫어요 누른 음식을 localStorage로 관리하는 커스텀 훅

"use client";

import { useCallback } from "react";

// 싫어요 저장하는 key
const DISLIKE_KEY = "dislikedFoods";

export function useDislikeManager() {
  // DOCORE: 2025-04-20 13:20 싫어요 누른 음식 저장
  const saveDislikedFood = useCallback((food: string) => {
    const dislikes = JSON.parse(localStorage.getItem(DISLIKE_KEY) || "{}");
    dislikes[food] = Date.now();
    localStorage.setItem(DISLIKE_KEY, JSON.stringify(dislikes));
  }, []);

  // DOCORE: 2025-04-20 13:20 특정 음식이 최근 7일 이내 싫어요인지 체크
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
