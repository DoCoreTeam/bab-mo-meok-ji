"use client";

import { useState, useEffect } from "react";

function isInAppBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes("kakaotalk") ||
      ua.includes("instagram") ||
      ua.includes("facebook") ||
      ua.includes("naver") ||
      ua.includes("line") ||
      ua.includes("whatsapp") ||
      ua.includes("telegram")
    );
  }
  

export default function OpenInBrowserButtons() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) {
      setShouldShow(true);
    }
  }, []);

  const handleOpen = () => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("macintosh")) {
      alert("상단 메뉴에서 '기본 브라우저로 열기'를 선택해주세요! 🙏");
    } else if (ua.includes("android")) {
      const url = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      window.open(window.location.href, "_blank");
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={handleOpen}
        className="px-6 py-3 bg-black text-white text-sm rounded-full shadow-lg hover:bg-gray-800 transition"
      >
        👉 기본 브라우저로 열기
      </button>
    </div>
  );
}
