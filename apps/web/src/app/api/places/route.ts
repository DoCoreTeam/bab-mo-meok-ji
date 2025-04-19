// DOCORE: "밥 뭐먹지?" - Google Places API 프록시 (Vercel 서버리스 대응)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
  
    if (!url) {
      return new Response(JSON.stringify({ error: "URL 없음" }), { status: 400 });
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Google Places API 호출 실패:", error);
      return new Response(JSON.stringify({ error: "API 호출 실패" }), { status: 500 });
    }
  }
  