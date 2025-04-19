"use client";

import React from "react";

interface PlaceCardProps {
  name: string;
  category: string;
  address: string;
  kakaoId: string;
  children: React.ReactNode;
}

function PlaceCard({ name, category, address, kakaoId, children }: PlaceCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-md">
      <a
        href={`https://place.map.kakao.com/${kakaoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl font-bold underline hover:text-blue-600 block mb-2"
      >
        {name}
      </a>
      <p className="text-gray-600">{category}</p>
      <p className="text-gray-500 text-sm">{address}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default PlaceCard;
