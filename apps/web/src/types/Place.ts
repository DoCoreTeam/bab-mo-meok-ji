// // src/types/Place.ts

// export type Place = {
//   name: string;
//   kakaoName: string;
//   kakaoId: string;
//   rating: number;
//   address: string;
//   lat: number;
//   lng: number;
//   category: string;
// };

// apps/web/src/types/Place.ts

/**
 * 음식점 카테고리 타입 정의
 */
export interface Category {
  id: number;
  kor_name: string;
  eng_keyword: string;
  icon_url?: string;
  description?: string;
}

/**
 * 추천될 장소(Place) 타입 정의
 */
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

