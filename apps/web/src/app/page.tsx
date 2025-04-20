// DOCORE: 2025-04-20 14:30 Kakao 음식 추천 서비스 메인 페이지 (AI 추천 흐름 포함, 오류 제거)

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/app/components/Layout";
import { CategoryButton } from "@/app/components/CategoryButton";
import PlaceCard from "@/app/components/PlaceCard";
import ActionButtons from "@/app/components/ActionButtons";
import { supabase } from "@/lib/supabaseClient";
import KakaoMap from "@/app/components/Map/KakaoMap";
import { fetchAdditionalRecommendations } from "@/lib/openai"; // DOCORE: 2025-04-20 10:50 OpenAI 추가 음식 추천 API
import AiReview from "@/app/components/AiReview"; // DOCORE: 2025-04-20 13:35 AI 평가 컴포넌트 분리 적용
import SelectFavoriteFoods from "@/app/components/SelectFavoriteFoods"; // DOCORE: 2025-04-20 13:35 선호 음식 선택 컴포넌트 분리 적용
import LoadingScreen from "@/app/components/LoadingScreen"; // DOCORE: 2025-04-20 13:35 로딩 화면 컴포넌트 분리 적용
import { useDislikeManager } from "@/app/hooks/useDislikeManager"; // DOCORE: 2025-04-20 13:35 싫어요 관리 훅 적용

// DOCORE: 현재 시간에 따라 소개할 음식 타입(식사, 간식, 술안주) 결정
function getCurrentMealType(): "meal" | "snack" | "alcohol" {
  const now = new Date();
  const hour = now.getHours();
  if ((hour >= 7 && hour < 10) || (hour >= 11 && hour < 14) || (hour >= 17 && hour < 20)) return "meal";
  if ((hour >= 10 && hour < 11) || (hour >= 14 && hour < 17)) return "snack";
  if (hour >= 18 || hour < 6) return "alcohol";
  return "meal";
}

// DOCORE: 현재 가장 적절한 체용 문구 설정
const typeLabel = {
  meal: "🍽️ 지금은 식사 추천 시간입니다!",
  snack: "🍩 지금은 간식 추천 시간입니다!",
  alcohol: "🍻 지금은 술안주 추천 시간입니다!",
}[getCurrentMealType()];

// 타입 정의
export interface Category {
  id: number;
  kor_name: string;
  eng_keyword: string;
  icon_url?: string;
  description?: string;
}

export interface Place {
  name: string;
  kakaoName: string;
  kakaoId: string;
  rating: number;
  address: string;
  lat: number;
  lng: number;
  category: string;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);
  const [started, setStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"select" | "aiReview" | "recommend" | "finished">("select");
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiCategories, setAiCategories] = useState<Category[]>([]);
  const [aiReviewIndex, setAiReviewIndex] = useState(0);

  const { saveDislikedFood } = useDislikeManager(); // 싫어요 기록용

  // Splash
  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let rafId: number;
    const update = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(update);
      } else {
        setProgress(100);
        setShowSplash(false);
      }
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 카테고리 로드
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
        const mealType = getCurrentMealType();
        const filtered = data.filter(cat => cat.type === mealType);
        setCategories(shuffle(filtered).slice(0, 10));
      }
    }
    loadCategories();
  }, []);

  // 장소 추천
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
      try {
        const queries = selectedFoods.map(food => categories.find(c => c.eng_keyword === food)?.kor_name ?? food).join(",");
        const params = new URLSearchParams({ keywords: queries, lat: location.lat.toString(), lng: location.lng.toString(), radius: "1000" });
        const res = await fetch(`/api/search?${params}`);
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
          setSelectedPlace(fetched[Math.floor(Math.random() * fetched.length)]);
          setUsedPlaces([]);
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
  }, [started, location, selectedFoods, categories]);

  // 핸들러
  const handleStartRecommendation = async () => {
    if (!selectedFoods.length) {
      alert("선호 음식을 최소 1개 선택하세요!");
      return;
    }
    setIsStarting(true);
    const aiRecommendations = await fetchAdditionalRecommendations(selectedFoods);
    const additionalCategories = aiRecommendations.map((food: string, index: number) => ({
      id: 20000 + index,
      kor_name: food,
      eng_keyword: food.toLowerCase().replace(/\s+/g, "-"),
      type: "meal",
    }));
    setAiCategories(additionalCategories);
    setAiReviewIndex(0);
    setViewMode("aiReview");
    setIsStarting(false);
  };

  const handleAiReview = (liked: boolean) => {
    const current = aiCategories[aiReviewIndex];
    if (liked) {
      setSelectedFoods(prev => [...prev, current.eng_keyword]);
    } else {
      saveDislikedFood(current.eng_keyword);
    }
    if (aiReviewIndex + 1 < aiCategories.length) {
      setAiReviewIndex(prev => prev + 1);
    } else {
      setViewMode("select");
    }
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
    setIsStarting(false);
  };

  if (showSplash) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      {categories.length === 0 ? (
        <LoadingScreen />
      ) : viewMode === "aiReview" && aiCategories.length > 0 ? (
        <AiReview
          foodName={aiCategories[aiReviewIndex].kor_name}
          onLike={() => handleAiReview(true)}
          onDislike={() => handleAiReview(false)}
        />
      ) : viewMode === "select" ? (
        <SelectFavoriteFoods
          categories={categories}
          selectedFoods={selectedFoods}
          onToggleFood={(food) =>
            setSelectedFoods(prev =>
              prev.includes(food)
                ? prev.filter(f => f !== food)
                : prev.length < 5
                ? [...prev, food]
                : prev
            )
          }
          onStartRecommendation={handleStartRecommendation}
          isStarting={isStarting}
          typeLabel={typeLabel}
        />
      ) : loading ? (
        <LoadingScreen />
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
          <ActionButtons onAnother={handleAnotherRecommendation} onRestart={handleRestart} isFinished={false} />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-center">추천할 맛집이 없습니다.</p>
          <ActionButtons onAnother={handleAnotherRecommendation} onRestart={handleRestart} isFinished />
        </div>
      )}
    </Layout>
  );
}
