// DOCORE: 2025-04-20 15:10 오늘 뭐 먹지 메인 페이지 (Splash → 음식 선택 → AI 추천 → 좋아요/싫어요 → 추천 검색)

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

// 현재 시간에 따라 추천 타입 결정
function getCurrentMealType(): "meal" | "snack" | "alcohol" {
  const now = new Date();
  const hour = now.getHours();
  if ((hour >= 7 && hour < 10) || (hour >= 11 && hour < 14) || (hour >= 17 && hour < 20)) return "meal";
  if ((hour >= 10 && hour < 11) || (hour >= 14 && hour < 17)) return "snack";
  if (hour >= 18 || hour < 6) return "alcohol";
  return "meal";
}

export default function Home() {
  // 상태
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [aiFoods, setAiFoods] = useState<string[]>([]);
  const [step, setStep] = useState<"splash" | "select" | "aiReview" | "search" | "recommend" | "finished">("splash");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [usedPlaces, setUsedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { saveDislikedFood, isFoodDisliked } = useDislikeManager();

  // Splash 로딩
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

  // 카테고리 로드
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("food_categories").select("*");
      if (data) {
        const mealType = getCurrentMealType();
        const filtered = data
          .filter(cat => cat.type === mealType)
          .filter(cat => !isFoodDisliked(cat.eng_keyword));

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
    }
    if (step === "select") {
      loadCategories();
    }
  }, [step]);

  // 위치 정보 가져오기
  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.5665, lng: 126.978 }) // 서울 기본 좌표
      );
    }
  }, []);

  // 추천 검색
  useEffect(() => {
    async function fetchPlaces() {
      if (!location) return;
      setLoading(true);
      try {
        const queries = selectedFoods.join(",");
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
          setStep("recommend");
        } else {
          setStep("finished");
        }
      } catch {
        setStep("finished");
      } finally {
        setLoading(false);
      }
    }

    if (step === "search") {
      fetchPlaces();
    }
  }, [step, location, selectedFoods]);

  // 핸들러
  const handleSelectNext = async () => {
    setLoading(true); // ✅ 버튼 누르자마자 스피너
    const aiRecommendations = await fetchAdditionalRecommendations(selectedFoods);
    setAiFoods(aiRecommendations.slice(0, 2));
    setLoading(false); // ✅ AI 추천 완료되면 스피너 끄고
    setStep("aiReview"); // ✅ 그 다음 AI 추천 화면으로 이동
  };
  

  const handleAcceptAiFoods = () => {
    const combined = [...selectedFoods, ...aiFoods.map(f => f.toLowerCase().replace(/\s+/g, "-"))];
    setSelectedFoods(combined);
    setStep("search");
  };

  const handleRejectAiFoods = () => {
    aiFoods.forEach(food => {
      const slug = food.toLowerCase().replace(/\s+/g, "-");
      saveDislikedFood(slug);
    });
    setStep("search");
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
        />
      ) : step === "aiReview" ? (
        <AiAdditionalFoods
          aiFoods={aiFoods}
          onAccept={handleAcceptAiFoods}
          onReject={handleRejectAiFoods}
        />
      ) : loading ? (
        <LoadingScreen />
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
          <ActionButtons
            onAnother={handleAnotherRecommendation}
            onRestart={handleRestart}
            isFinished={false}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-lg font-semibold">추천할 맛집이 없습니다 😢</p>
          <ActionButtons
            onAnother={handleAnotherRecommendation}
            onRestart={handleRestart}
            isFinished
          />
        </div>
      )}
    </Layout>
  );
}
