// apps/web/src/app/components/OpenInBrowserButtons.tsx
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
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("macintosh")) {
      // 아이폰, 아이패드, 맥 - 새창으로 띄워서 사파리 기본 브라우저 유도
      window.open(window.location.href, "_blank");
    } else if (ua.includes("android")) {
      // 안드로이드 - intent:// 크롬 열기
      const url = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      // fallback
      window.open(window.location.href, "_blank");
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={openInDefaultBrowser}
        className="px-6 py-3 bg-blue-600 text-white text-base rounded-full shadow-xl hover:bg-blue-700 active:scale-95 transition"
      >
        👉 기본 브라우저로 열기
      </button>
    </div>
  );
}
