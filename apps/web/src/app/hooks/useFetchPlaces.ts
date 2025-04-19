// DOCORE: 추천 장소 가져오기 + localStorage 저장/복구 완성본

import { useState, useEffect } from "react";
import { Place } from "@/types/Place";

export function useFetchPlaces(location: { lat: number; lng: number } | null, selectedFoods: string[], started: boolean) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 초기 localStorage 복구
  useEffect(() => {
    const savedPlaces = localStorage.getItem("places");
    if (savedPlaces) {
      setPlaces(JSON.parse(savedPlaces));
    }
  }, []);

  // --- location + started + selectedFoods 조건 만족 시 fetch
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!location || !started || selectedFoods.length === 0) return;

      setLoading(true);

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
        const radius = 500;

        let allPlaces: Place[] = [];

        for (const food of selectedFoods) {
          const keyword = food; // 여긴 필요한 경우 매핑 추가
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;
          
          const res = await fetch(`/api/places?url=${encodeURIComponent(url)}`);
          const data = await res.json();

          const validPlaces = (data.results || []).filter((p: any) => p.rating && p.geometry);

          for (const p of validPlaces) {
            const kakaoRes = await fetch(`/api/kakao-rating?name=${encodeURIComponent(p.name)}`);
            const kakaoData = await kakaoRes.json();

            if (kakaoData.name) {
              allPlaces.push({
                name: p.name,
                kakaoName: kakaoData.name,
                kakaoId: kakaoData.kakaoId || "",
                rating: p.rating,
                address: kakaoData.address,
                lat: p.geometry.location.lat,
                lng: p.geometry.location.lng,
                category: food,
              });
            }
          }
        }

        setPlaces(allPlaces);
        localStorage.setItem("places", JSON.stringify(allPlaces));

      } catch (err) {
        console.error("맛집 가져오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [location, started, selectedFoods]);

  return { places, loading };
}
