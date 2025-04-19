// apps/web/src/app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywordsParam = searchParams.get("keywords") || "";
  const lat = searchParams.get("lat") || "0";
  const lng = searchParams.get("lng") || "0";
  const radius = searchParams.get("radius") || "2000";
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

