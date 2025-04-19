// apps/web/src/app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywordsParam = searchParams.get("keywords") || "";
  const lat = searchParams.get("lat") || "0";
  const lng = searchParams.get("lng") || "0";
  const radius = searchParams.get("radius") || "100";
  const restKey = process.env.KAKAO_REST_API_KEY;

  if (!restKey) {
    return NextResponse.json({ error: "REST API key not configured" }, { status: 500 });
  }

  const keywords = keywordsParam.split(",").map(k => k.trim()).filter(Boolean);
  let allDocs: any[] = [];

  for (const kw of keywords) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(kw)}&y=${lat}&x=${lng}&radius=${radius}&size=15`;
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${restKey}` } });
    const json = await res.json();
    if (Array.isArray(json.documents)) allDocs = allDocs.concat(json.documents);
  }

  const uniqueDocs = Array.from(
    new Map(allDocs.map(d => [d.place_name, d])).values()
  );

  return NextResponse.json({ documents: uniqueDocs });
}

// apps/web/src/app/api/search/route.ts
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const keywords = searchParams.get("keywords") || "";
//   const lat = searchParams.get("lat") || "37.5665";
//   const lng = searchParams.get("lng") || "126.978";
//   const radius = searchParams.get("radius") || "2000";

//   // Kakao Local Search API 호출
//   const kakaoRes = await fetch(
//     `https://dapi.kakao.com/v2/local/search/keyword.json?query=${keywords}&x=${lng}&y=${lat}&radius=${radius}`,
//     {
//       headers: {
//         Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
//       },
//     }
//   );
//   const kakaoJson = await kakaoRes.json();
//   const documents = kakaoJson.documents;

//   // 평가점수 필터링: 구글 별점 3.0 이상만 사용
//   const filteredDocs = [] as typeof documents;
//   for (const doc of documents) {
//     // 카카오 장소 상세 API로 평점 가져오기
//     const detailRes = await fetch(
//       `https://dapi.kakao.com/v2/local/search/category.json?query=${doc.id}`
//     );
//     // (예시) detailJson.rating이 실제 평점을 가져온다고 가정
//     const detailJson = await detailRes.json();
//     const rating = detailJson.rating ?? 0;

//     if (rating >= 3) {
//       filteredDocs.push(doc);
//     }
//   }

//   return NextResponse.json({ documents: filteredDocs });
// }
