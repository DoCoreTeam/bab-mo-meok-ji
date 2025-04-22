// DOCORE: 2025-04-20 19:20 PlaceCard children 필수 반영 완료 최종본 + eslint 정리 + 플로우 변경 (선택 → 맛집 → AI 추천, 싫어요 시 AI 추가 추천) + "AI 추천 안내" 개선 적용 완료

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

interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  address_name: string;
  y: string;
  x: string;
  category_name?: string;
}

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
  const [step, setStep] = useState<"splash" | "select" | "loading" | "aiReady" | "aiReview" | "search" | "recommend" | "finished">("splash");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { saveDislikedFood } = useDislikeManager();

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

  const loadCategories = async () => {
    const { data } = await supabase.from("food_categories").select("*");
    if (data) {
      const mealType = getCurrentMealType();
      let filtered = data.filter(cat => cat.type === mealType);
      if (filtered.length === 0) {
        console.warn(`[경고] ${mealType} 타입 음식 부족`);
        filtered = data;
      }
      const shuffle = <T,>(arr: T[]): T[] => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };
      setCategories(shuffle(filtered).slice(0, 10));
    }
  };

  useEffect(() => {
    if (step === "select") {
      loadCategories();
    }
  }, [step]);

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.5665, lng: 126.978 })
      );
    }
  }, [location]);

  useEffect(() => {
    async function fetchPlaces() {
      if (!location) return;
      const queries = selectedFoods
        .map(slug => categories.find(c => c.eng_keyword === slug)?.kor_name || slug)
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
        const fetched: Place[] = (documents as KakaoPlaceDocument[]).map(doc => ({
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
          setStep("aiReady");
        }
      } catch (error) {
        console.error("맛집 검색 실패", error);
        setStep("finished");
      }
    }
    if (step === "search" && location) {
      fetchPlaces();
    }
  }, [step, location, selectedFoods, categories]);

  // DOCORE: 2025-04-21 01:00 aiReady 시 자동으로 AI 추천 호출
  useEffect(() => {
    async function fetchAiRecommendation() {
      const aiResult = await fetchAdditionalRecommendations(selectedFoods);
      setAiFoods(aiResult.slice(0, 1)); // 하나만 추천
      setStep("aiReview");
    }

    if (step === "aiReady") {
      fetchAiRecommendation();
    }
  }, [step, selectedFoods]);

  const handleSelectNext = () => {
    if (selectedFoods.length === 0) {
      alert("최소 1개 이상의 선호 음식을 선택해주세요!");
      return;
    }
    setStep("search");
  };

  const handleAcceptAiFoods = () => {
    const combined = [...selectedFoods, ...aiFoods.map(f => f.toLowerCase().replace(/\s+/g, "-"))];
    setSelectedFoods(combined);
    setAiFoods([]);
    setStep("search");
  };

  const handleRejectAiFoods = async () => {
    if (aiFoods.length === 0) {
      setStep("finished");
      return;
    }
    const disliked = aiFoods[0];
    const slug = disliked.toLowerCase().replace(/\s+/g, "-");
    saveDislikedFood(slug);

    setStep("loading");
    const newAiFoods = await fetchAdditionalRecommendations(selectedFoods);
    setAiFoods(newAiFoods.slice(0, 1));
    setStep("aiReview");
  };

  const handleAnotherRecommendation = () => {
    const available = places.filter(p => !usedPlaces.some(u => u.name === p.name));
    if (available.length && selectedPlace) {
      const next = available[Math.floor(Math.random() * available.length)];
      setSelectedPlace(next);
      setUsedPlaces(prev => [...prev, next]);
    } else {
      setStep("aiReady");
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
              prev.includes(food) ? prev.filter(f => f !== food) : prev.length < 5 ? [...prev, food] : prev
            )
          }
          onNext={handleSelectNext}
          onRefresh={loadCategories}
          typeLabel={typeLabel}
        />
      ) : step === "loading" ? (
        <LoadingScreen />
      ) : step === "aiReady" ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl font-semibold mb-4">✨ 추천할 맛집이 없어요!</p>
          <p className="text-gray-500">당신의 취향을 고려해 새로운 음식을 AI가 추천하고 있어요...</p>
        </div>
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
      ) : step === "finished" && selectedPlace ? (
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
          <p className="text-center text-lg font-semibold">모든 추천이 완료되었습니다!</p>
          <ActionButtons onAnother={handleAnotherRecommendation} onRestart={handleRestart} isFinished />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </Layout>
  );
}
