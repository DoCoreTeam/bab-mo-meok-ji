// apps/web/src/app/components/ActionButtons.tsx

"use client";

import React from "react";

interface ActionButtonsProps {
  onAnother: () => void;
  onRestart: () => void;
  isFinished: boolean;
}

export default function ActionButtons({ onAnother, onRestart, isFinished }: ActionButtonsProps) {
  return (
    <div className="flex flex-row justify-center items-center gap-4 mt-6">
      {!isFinished && (
        <button
          className={
            `flex-1 py-3 px-5 text-white font-semibold rounded-2xl
             bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600
             transition-shadow shadow-md hover:shadow-xl
             dark:from-teal-600 dark:to-blue-700 dark:hover:from-teal-700 dark:hover:to-blue-800`
          }
          onClick={onAnother}
        >
          다음 추천
        </button>
      )}
      <button
        className={
          `flex-1 py-3 px-5 font-semibold rounded-2xl transition-shadow shadow-sm hover:shadow-md
           bg-gray-100 text-gray-800 hover:bg-gray-200
           dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`
        }
        onClick={onRestart}
      >
        {isFinished ? "처음으로 돌아가기" : "다시 선택"}
      </button>
    </div>
  );
}
