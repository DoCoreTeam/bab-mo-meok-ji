// apps/web/src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { CategoryButton } from "@/app/components/CategoryButton";
import PlaceCard from "@/app/components/PlaceCard";
import ActionButtons from "@/app/components/ActionButtons";
import { supabase } from "@/lib/supabaseClient";
import KakaoMap from "@/app/components/Map/KakaoMap";

// 카테고리 타입
type Category = {
  id: number;
  kor_name: string;
  eng_keyword: string;
  icon_url?: string;
  description?: string;
};

// 장소 정보 타입
type Place = {
  name: string;
  kakaoName: string;
  kakaoId: string;
  rating: number;
  address: string;
  lat: number;
  lng: number;
  category: string;
};

export default function Home() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  // 위치, 선택된 음식, 추천 로직 상태
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"select" | "recommend" | "finished">("select");
  const [categories, setCategories] = useState<Category[]>([]);

  // Splash timeout (2초 후 메인으로)
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 1) 카테고리 로드 & 랜덤 셔플
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("food_categories").select("*");
      if (data) {
        const shuffle = <T,>(arr: T[]): T[] => {
          const a = [...arr];
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };
        setCategories(shuffle(data));
      }
    }
    loadCategories();
  }, []);

  // 2) 추천 로직: 시작, 위치, 음식 선택 변경 시
  useEffect(() => {
    if (!started) return;
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.5665, lng: 126.978 })
      );
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      if (!selectedFoods.length) {
        setViewMode("finished");
        setLoading(false);
        return;
      }
      try {
        const params = new URLSearchParams({
          keywords: selectedFoods.join(","),
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          radius: "1000",
        });
        const res = await fetch(`/api/search?${params.toString()}`);
        const { documents } = await res.json();
        const fetched: Place[] = documents.map((doc: any) => ({
          name: doc.place_name,
          kakaoName: doc.place_name,
          kakaoId: doc.id,
          rating: 0,
          address: doc.address_name,
          lat: parseFloat(doc.y),
          lng: parseFloat(doc.x),
          category: doc.category_name || "",
        }));
        if (fetched.length) {
          setPlaces(fetched);
          const first = fetched[Math.floor(Math.random() * fetched.length)];
          setSelectedPlace(first);
          setUsedPlaces([first]);
          setViewMode("recommend");
        } else {
          setViewMode("finished");
        }
      } catch {
        setViewMode("finished");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [started, location, selectedFoods]);

  // 이벤트 핸들러
  const handleStartRecommendation = () => {
    if (!selectedFoods.length) return alert("선호 음식을 최소 1개 선택하세요!");
    setStarted(true);
  };
  const handleAnotherRecommendation = () => {
    const available = places.filter(p => !usedPlaces.some(u => u.name === p.name));
    if (available.length && selectedPlace) {
      const next = available[Math.floor(Math.random() * available.length)];
      setSelectedPlace(next);
      setUsedPlaces(prev => [...prev, next]);
    } else {
      setViewMode("finished");
    }
  };
  const handleRestart = () => {
    setSelectedFoods([]);
    setStarted(false);
    setPlaces([]);
    setSelectedPlace(null);
    setUsedPlaces([]);
    setViewMode("select");
  };

  // Splash 화면
  if (showSplash) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold">오늘 밥 뭐먹지?</h1>
      </div>
    );
  }

  // 메인 UI
  return (
    <Layout>
      {categories.length === 0 ? (
        <p>카테고리 불러오는 중...</p>
      ) : viewMode === "select" ? (
        <div className="w-full max-w-md mx-auto">
          <p className="text-center mb-2">오늘은 뭐 먹을거예요?</p>
          <p className="text-center mb-4">좋아하는 음식을 선택하세요 (최대 5개)</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map(cat => (
              <CategoryButton
                key={cat.id}
                label={cat.kor_name}
                selected={selectedFoods.includes(cat.eng_keyword)}
                onClick={() =>
                  setSelectedFoods(prev =>
                    prev.includes(cat.eng_keyword)
                      ? prev.filter(f => f !== cat.eng_keyword)
                      : prev.length < 5
                      ? [...prev, cat.eng_keyword]
                      : prev
                  )
                }
              />
            ))}
          </div>
          <button
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            onClick={handleStartRecommendation}
          >
            추천 시작
          </button>
        </div>
      ) : loading ? (
        <p className="text-center">맛집 추천 중...</p>
      ) : viewMode === "recommend" && selectedPlace ? (
        <div className="flex flex-col items-center space-y-4">
          <PlaceCard
            name={selectedPlace.kakaoName}
            category={selectedPlace.category}
            address={selectedPlace.address}
            kakaoId={selectedPlace.kakaoId}
          >
            <div className="mt-4">
              <KakaoMap lat={selectedPlace.lat} lng={selectedPlace.lng} />
            </div>
          </PlaceCard>
          <ActionButtons
            onAnother={handleAnotherRecommendation}
            onRestart={handleRestart}
            isFinished={false}
          />
        </div>
      ) : viewMode === "finished" && selectedPlace ? (
        <div className="flex flex-col items-center space-y-4">
          <PlaceCard
            name={selectedPlace.kakaoName}
            category={selectedPlace.category}
            address={selectedPlace.address}
            kakaoId={selectedPlace.kakaoId}
          >
            <div className="mt-4">
              <KakaoMap lat={selectedPlace.lat} lng={selectedPlace.lng} />
            </div>
          </PlaceCard>
          <p className="text-center mt-4 text-lg font-semibold">모든 추천이 완료되었습니다!</p>
          <button
            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={handleRestart}
          >
            처음으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <p>추천할 맛집이 없습니다.</p>
          <ActionButtons onAnother={handleAnotherRecommendation} onRestart={handleRestart} isFinished />
        </div>
      )}
    </Layout>
  );
}
