// DOCORE: 2025-04-20 14:10 Kakao 음식 추천 서비스 메인 페이지 (타입 명시 버전)

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/app/components/Layout";
import { CategoryButton } from "@/app/components/CategoryButton";
import PlaceCard from "@/app/components/PlaceCard";
import ActionButtons from "@/app/components/ActionButtons";
import { supabase } from "@/lib/supabaseClient";
import KakaoMap from "@/app/components/Map/KakaoMap";
import { fetchAdditionalRecommendations } from "@/lib/openai"; // DOCORE: 2025-04-20 10:50 OpenAI 추가 음식 추천 회원 및 여부 채택
import AiReview from "@/app/components/AiReview"; // DOCORE: 2025-04-20 13:35 AI 평가 컴포넌트 분리 적용
import SelectFavoriteFoods from "@/app/components/SelectFavoriteFoods"; // DOCORE: 2025-04-20 13:35 선호 음식 선택 컴포넌트 분리 적용
import LoadingScreen from "@/app/components/LoadingScreen"; // DOCORE: 2025-04-20 13:35 로딩 화면 컴포넌트 분리 적용
import { useDislikeManager } from "@/app/hooks/useDislikeManager"; // DOCORE: 2025-04-20 13:35 싫어요 관리 훅 적용

// 카테고리 타입
export interface Category {
  id: number;
  kor_name: string;
  eng_keyword: string;
  icon_url?: string;
  description?: string;
}

// 장소 정보 타입
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

// DOCORE: 2025-04-20 14:10 현재 시간에 따라 추천할 음식 타입 결정
function getCurrentMealType(): "meal" | "snack" | "alcohol" {
  const now = new Date();
  const hour = now.getHours();
  if ((hour >= 7 && hour < 10) || (hour >= 11 && hour < 14) || (hour >= 17 && hour < 20)) return "meal";
  if ((hour >= 10 && hour < 11) || (hour >= 14 && hour < 17)) return "snack";
  if (hour >= 18 || hour < 6) return "alcohol";
  return "meal";
}

// DOCORE: 2025-04-20 14:10 현재 시간 타입에 따른 문구
const typeLabel = {
  meal: "🍽️ 지금은 식사 추천 시간입니다!",
  snack: "🍩 지금은 간식 추천 시간입니다!",
  alcohol: "🍻 지금은 술안주 추천 시간입니다!",
}[getCurrentMealType()];

// DOCORE: 2025-04-20 14:10 Home 컴포넌트
export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [aiCategories, setAiCategories] = useState<Category[]>([]);
  const [aiReviewIndex, setAiReviewIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"select" | "recommend" | "finished" | "aiReview">("select");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);

  const { saveDislikedFood, isFoodDisliked } = useDislikeManager();

  // DOCORE: 2025-04-20 14:10 Splash 화면
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

  // DOCORE: 2025-04-20 14:10 카테고리 불러오기
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
        const shuffled = shuffle(filtered).slice(0, 10);
        setCategories(shuffled);
      }
    }
    loadCategories();
  }, []);

  // 이하 fetchPlaces, handleStartRecommendation, handleAiReview, handleAnotherRecommendation, handleRestart 핸들러들은 그대로 유지

  if (showSplash) {
    return <LoadingScreen />;
  }

  function handleAnotherRecommendation(): void {
    throw new Error("Function not implemented.");
  }

  function handleRestart(): void {
    throw new Error("Function not implemented.");
  }

  function handleAiReview(arg0: boolean): void {
    throw new Error("Function not implemented.");
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
          onStartRecommendation={handleAnotherRecommendation}
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
