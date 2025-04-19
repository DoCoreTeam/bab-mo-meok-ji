// // apps/web/src/app/components/CategoryButton.tsx

// "use client";

// interface CategoryButtonProps {
//   label: string;
//   selected: boolean;
//   onClick: () => void;
// }

// // 2025 트렌드: 부드러운 그라데이션, 부드러운 그림자, 라운드 엣지 + 다크 모드
// export function CategoryButton({ label, selected, onClick }: CategoryButtonProps) {
//   return (
//     <button
//       className={
//         `w-full py-3 px-4 text-base font-medium rounded-2xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 ` +
//         (selected
//           ? // 선택된 상태
//             "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg " +
//             "dark:from-purple-600 dark:to-pink-600 dark:shadow-xl dark:text-gray-100"
//           : // 미선택 상태
//             "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-purple-300 shadow-sm " +
//             "dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:ring-pink-500 dark:shadow-sm")
//       }
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// }

"use client";

import React from "react";

interface CategoryButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

// 2025 트렌드: 부드러운 그라데이션, 부드러운 그림자, 라운드 엣지 + 터치 반응
export function CategoryButton({ label, selected, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-3 px-4 text-base font-medium rounded-2xl transition-transform transform
        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2
        active:scale-95 active:opacity-80
        ${selected
          ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg dark:from-purple-600 dark:to-pink-600"
          : "bg-white text-gray-700 ring-1 ring-gray-200 shadow-sm hover:ring-purple-300 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"}
      `}
    >
      {label}
    </button>
  );
}
