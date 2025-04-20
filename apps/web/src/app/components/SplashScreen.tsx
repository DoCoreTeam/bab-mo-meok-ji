// DOCORE: 2025-04-20 14:45 Splash 로딩 화면 컴포넌트

"use client";

import React from "react";
import Image from "next/image";

interface SplashScreenProps {
  progress: number;
}

export default function SplashScreen({ progress }: SplashScreenProps) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <Image
        src="/splash.png"
        alt="오늘 뭐먹지?"
        width={300}
        height={300}
        className="object-contain mb-4"
        priority
      />
      <div className="w-3/4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-base font-medium text-gray-700 dark:text-gray-300">{`${Math.floor(progress)}%`}</p>
    </div>
  );
}
