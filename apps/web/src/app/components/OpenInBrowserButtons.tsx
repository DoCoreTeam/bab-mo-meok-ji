// OpenInBrowserButtons.tsx
"use client";

import { useState, useEffect } from "react";

function isInAppBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("kakaotalk") ||
    ua.includes("instagram") ||
    ua.includes("facebook") ||
    ua.includes("naver")
  );
}

export default function OpenInBrowserButtons() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) {
      setShouldShow(true);
    }
  }, []);

  const openInDefaultBrowser = () => {
    if (navigator.userAgent.toLowerCase().includes("iphone") || navigator.userAgent.toLowerCase().includes("ipad")) {
      // 아이폰: 새 창 열기 (Universal Link)
      window.open(window.location.href, "_blank");
    } else {
      // 안드로이드: intent:// 시도
      const url = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    }

    // 버튼 사라지게
    setTimeout(() => {
      setShouldShow(false);
    }, 1000);
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={openInDefaultBrowser}
        className="px-6 py-3 bg-black text-white text-sm rounded-full shadow-lg hover:bg-gray-800 transition"
      >
        기본 브라우저로 열기
      </button>
    </div>
  );
}
