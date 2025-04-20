// DOCORE: 2025-04-20 12:55 AI 추천 음식 평가 화면 컴포넌트

"use client";

import React from "react";

interface AiReviewProps {
  foodName: string;
  onLike: () => void;
  onDislike: () => void;
}

export default function AiReview({ foodName, onLike, onDislike }: AiReviewProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <p className="text-lg font-semibold">🤖 AI가 추천한 음식은 어때요?</p>
      <div className="text-2xl">{foodName}</div>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={onLike}
        >
          좋아요 👍
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={onDislike}
        >
          싫어요 👎
        </button>
      </div>
    </div>
  );
}
