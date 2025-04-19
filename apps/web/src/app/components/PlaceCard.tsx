// apps/web/src/app/components/PlaceCard.tsx

"use client";

import React from "react";

interface PlaceCardProps {
  name: string;
  category: string;
  address: string;
  kakaoId: string;
  children: React.ReactNode;
}

export default function PlaceCard({ name, category, address, kakaoId, children }: PlaceCardProps) {
  return (
    <div className="
      w-full max-w-md p-6 rounded-xl shadow-lg
      bg-white text-gray-900
      dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl
      transition-colors duration-300 text-center
    ">
      <a
        href={`https://place.map.kakao.com/${kakaoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          text-2xl font-bold underline hover:text-blue-600
          dark:hover:text-blue-400
          block mb-2
        "
      >
        {name}
      </a>
      <p className="text-gray-600 dark:text-gray-300">{category}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{address}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
