// DOCORE: 2025-04-20 17:00 싫어요 클릭 후 검색 정상 작동 최종 수정

"use client";

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import SplashScreen from "@/app/components/SplashScreen";
import SelectFavoriteFoods from "@/app/components/SelectFavoriteFoods";
import AiAdditionalFoods from "@/app/components/AiAdditionalFoods";
import LoadingScreen from "@/app/components/LoadingScreen";
import PlaceCard from "@/app/components/PlaceCard";
import ActionButtons from "@/app/components/ActionButtons";
import KakaoMap from "@/app/components/Map/KakaoMap";
import { supabase } from "@/lib/supabaseClient";
import { fetchAdditionalRecommendations } from "@/lib/openai";
import { useDislikeManager } from "@/app/hooks/useDislikeManager";

// 타입
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

// 시간대별 타입
function getCurrentMealType(): "meal" | "snack" | "alcohol" {
  const now = new Date();
  const hour = now.getHours();
  if ((hour >= 7 && hour < 10) || (hour >= 11 && hour < 14) || (hour >= 17 && hour < 20)) {
    return "meal";
  }
  if ((hour >= 10 && hour < 11) || (hour >= 14 && hour < 17)) {
    return "snack";
  }
  return "alcohol";
}

// 추천 문구
const typeLabel = {
  meal: "🍽️ 지금은 식사 추천 시간입니다!",
  snack: "🍩 지금은 간식 추천 시간입니다!",
  alcohol: "🍻 지금은 술안주 추천 시간입니다!",
}[getCurrentMealType()];

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [aiFoods, setAiFoods] = useState<string[]>([]);
  const [step, setStep] = useState<"splash" | "select" | "loading" | "aiReview" | "search" | "recommend" | "finished">("splash");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { saveDislikedFood } = useDislikeManager();

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
        setStep("select");
      }
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 카테고리 불러오기
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("food_categories").select("*");
      if (data) {
        const mealType = getCurrentMealType();
        const filtered = data.filter(cat => cat.type === mealType);
        setCategories(filtered.slice(0, 10));
      }
    }
    if (step === "select") {
      loadCategories();
    }
  }, [step]);

  // 위치 가져오기
  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.5665, lng: 126.978 }) // 기본 서울
      );
    }
  }, []);

  // 맛집 검색
  useEffect(() => {
    async function fetchPlaces() {
      if (!location) return;

      // ✅ 여기 핵심: selectedFoods(slug) -> categories 찾아서 kor_name으로 변환해서 검색
      const queries = selectedFoods
        .map(slug => {
          const cat = categories.find(c => c.eng_keyword === slug);
          return cat?.kor_name || slug;
        })
        .join(",");

      const params = new URLSearchParams({
        keywords: queries,
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        radius: "1000",
      });

      try {
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

        if (fetched.length > 0) {
          setPlaces(fetched);
          setSelectedPlace(fetched[Math.floor(Math.random() * fetched.length)]);
          setUsedPlaces([]);
          setStep("recommend");
        } else {
          setStep("finished");
        }
      } catch (error) {
        console.error("맛집 검색 실패:", error);
        setStep("finished");
      }
    }

    if (step === "search") {
      fetchPlaces();
    }
  }, [step, location, selectedFoods, categories]);

  // 핸들러
  const handleSelectNext = async () => {
    setStep("loading");
    const aiRecommendations = await fetchAdditionalRecommendations(selectedFoods);
    setAiFoods(aiRecommendations.slice(0, 2));
    setStep("aiReview");
  };

  const handleAcceptAiFoods = () => {
    const combined = [
      ...selectedFoods,
      ...aiFoods.map(f => f.toLowerCase().replace(/\s+/g, "-")),
    ];
    setSelectedFoods(combined);
    setAiFoods([]);
    setStep("search");
  };

  const handleRejectAiFoods = () => {
    aiFoods.forEach(food => {
      const slug = food.toLowerCase().replace(/\s+/g, "-");
      saveDislikedFood(slug);
    });
    setAiFoods([]);
    setStep("search"); // selectedFoods 그대로 유지!
  };

  const handleAnotherRecommendation = () => {
    const available = places.filter(p => !usedPlaces.some(u => u.name === p.name));
    if (available.length && selectedPlace) {
      const next = available[Math.floor(Math.random() * available.length)];
      setSelectedPlace(next);
      setUsedPlaces(prev => [...prev, next]);
    } else {
      setStep("finished");
    }
  };

  const handleRestart = () => {
    setSelectedFoods([]);
    setAiFoods([]);
    setPlaces([]);
    setSelectedPlace(null);
    setUsedPlaces([]);
    setStep("select");
  };

  // 화면 렌더링
  return (
    <Layout>
      {showSplash ? (
        <SplashScreen progress={progress} />
      ) : step === "select" ? (
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
          onNext={handleSelectNext}
          typeLabel={typeLabel}
        />
      ) : step === "loading" ? (
        <LoadingScreen />
      ) : step === "aiReview" ? (
        <AiAdditionalFoods
          aiFoods={aiFoods}
          onAccept={handleAcceptAiFoods}
          onReject={handleRejectAiFoods}
        />
      ) : step === "recommend" && selectedPlace ? (
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
        <LoadingScreen />
      )}
    </Layout>
  );
}
