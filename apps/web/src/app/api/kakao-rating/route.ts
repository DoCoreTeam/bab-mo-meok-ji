// DOCORE: "밥 뭐먹지?" - 카카오맵 검색 결과 가져오기 (이름 + 주소)

import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return new Response(JSON.stringify({ error: "가게 이름이 없습니다." }), { status: 400 });
  }

  try {
    const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

    const searchUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(name)}`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        Authorization: `KakaoAK ${kakaoRestApiKey}`,
      },
    });

    if (!data.documents || data.documents.length === 0) {
      return new Response(JSON.stringify({ name: null, address: null, kakaoId: null }), { status: 200 });
    }

    const firstPlace = data.documents[0];

    return new Response(JSON.stringify({
      name: firstPlace.place_name,
      address: firstPlace.road_address_name || firstPlace.address_name,
      kakaoId: firstPlace.id,
    }), { status: 200 });

  } catch (error) {
    console.error("카카오 검색 실패:", error);
    return new Response(JSON.stringify({ error: "카카오 검색 오류" }), { status: 500 });
  }
}
