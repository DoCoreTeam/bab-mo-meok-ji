// DOCORE: Supabase 음식 카테고리 가져오기 API

// import { supabase } from "@/lib/supabaseClient";

// export async function GET() {
//   const { data, error } = await supabase
//     .from('food_categories')
//     .select('*')
//     .order('round', { ascending: true });

//   if (error) {
//     console.error('카테고리 가져오기 실패:', error);
//     return new Response(JSON.stringify({ error: "카테고리 오류" }), { status: 500 });
//   }

//   return new Response(JSON.stringify(data), { status: 200 });
// }

// apps/web/src/app/api/categories/route.ts
import { NextResponse } from "next/server";

type ExternalCategory = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

type ApiResponse = { categories: ExternalCategory[] };

export async function GET() {
  try {
    // TheMealDB 공개 API: 음식 카테고리 정보를 가져옵니다.
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const json: ApiResponse = await res.json();

    // JSON.categories 배열을 매핑하여 로컬 타입으로 변환
    const categories = json.categories.map((cat, idx) => ({
      id: idx + 1,
      kor_name: cat.strCategory,
      eng_keyword: cat.strCategory.toLowerCase(),
      icon_url: cat.strCategoryThumb,
      description: cat.strCategoryDescription,
    }));

    return NextResponse.json({ categories });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json(
      { error: "외부 카테고리 API 호출 실패" },
      { status: 500 }
    );
  }
}
