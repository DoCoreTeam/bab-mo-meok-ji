// DOCORE: 2025-04-22 01:25 날씨 기반 추천을 위한 weatherFetcher.ts 추가

import { useEffect, useState } from "react";

interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
}

export function useWeather(lat: number, lng: number) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=kr&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        const info: WeatherInfo = {
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        };
        setWeather(info);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("날씨 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (lat && lng) {
      fetchWeather();
    }
  }, [lat, lng]);

  return { weather, loading, error };
}

// DOCORE: 2025-05-02 날씨 조건 기반 제외 음식 카테고리 추출 함수 추가
export function getWeatherSensitiveFilters(weather: WeatherInfo | null): string[] {
  if (!weather) return [];

  const dislikes: string[] = [];

  const temp = weather.temp;
  const desc = weather.description;

  if (desc.includes("비") || desc.includes("소나기")) {
    dislikes.push("튀김", "냉면", "빙수", "아이스크림", "샐러드");
  }

  if (desc.includes("눈")) {
    dislikes.push("아이스크림", "빙수", "냉면", "샐러드");
  }

  if (desc.includes("맑음")) {
    // 맑은 날에는 기름진 음식 비선호
    dislikes.push("부대찌개", "곱창", "막창", "삼겹살");
  }

  if (temp >= 30) {
    dislikes.push("국밥", "라면", "부대찌개", "갈비탕", "전골");
  }

  if (temp <= 0) {
    dislikes.push("냉면", "샐러드", "아이스크림", "빙수");
  }

  return dislikes;
}

