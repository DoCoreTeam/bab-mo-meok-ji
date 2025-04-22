// DOCORE: 2025-04-20 22:00 메신저 내장 브라우저 문제 해결용, 외부 브라우저 열기 버튼 컴포넌트 최종본

"use client";

import React from "react";

const openInChrome = () => {
  const url = window.location.href;
  const chromeUrl = `googlechrome://navigate?url=${url}`;
  window.location.href = chromeUrl;
};

const openInSafari = () => {
  const url = window.location.href;
  window.open(url, "_blank");
};

export default function OpenInBrowserButtons() {
  return (
    <div className="flex flex-col space-y-3 mt-8">
      <button
        onClick={openInChrome}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform active:scale-95 active:opacity-80"
      >
        📱 크롬 앱으로 열기 (Android)
      </button>

      <button
        onClick={openInSafari}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform active:scale-95 active:opacity-80"
      >
        🍎 사파리 앱으로 열기 (iPhone)
      </button>
    </div>
  );
}
