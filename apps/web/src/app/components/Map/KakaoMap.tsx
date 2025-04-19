// apps/web/src/app/components/Map/KakaoMap.tsx
"use client";

import { useEffect, useRef } from "react";
declare global { interface Window { kakao: any; } }

export default function KakaoMap({ lat, lng }: { lat: number; lng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tryInit = () => {
      if (!window.kakao || !window.kakao.maps) {
        // SDK가 아직 로드 전이면 잠시 대기 후 재시도
        setTimeout(tryInit, 500);
        return;
      }
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;
        const options = { center: new window.kakao.maps.LatLng(lat, lng), level: 3 };
        const map = new window.kakao.maps.Map(container, options);
        new window.kakao.maps.Marker({ map, position: new window.kakao.maps.LatLng(lat, lng) });
      });
    };

    if (typeof window !== "undefined") {
      tryInit();
    }
  }, [lat, lng]);

  return <div ref={mapRef} className="w-full h-64 rounded-xl bg-gray-200" />;
}
