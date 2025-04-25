// DOCORE: 카카오맵 장소 상세정보 전체 가져오기 API

import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kakaoId = searchParams.get("id");

  if (!kakaoId) {
    return new Response(JSON.stringify({ error: "카카오 ID가 없습니다." }), { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    const { data } = await axios.get(`https://place.map.kakao.com/main/v/${kakaoId}`, {
      headers: {
        Referer: "https://map.kakao.com/",
      },
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("카카오 상세정보 가져오기 실패:", error);
    return new Response(JSON.stringify({ error: "카카오 상세정보 오류" }), { status: 500 });
  }
}
