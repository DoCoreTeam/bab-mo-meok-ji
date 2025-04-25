// src/lib/openai.ts
// DOCORE: OpenAI API를 통해 사용자 선호도를 기반으로 음식 추천 호출

export async function fetchAdditionalRecommendations(selectedFoods: string[]): Promise<string[]> {
    if (!selectedFoods.length) return [];
  
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API 키가 없습니다.");
      return [];
    }
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "다음 음식들: [국밥, 돈까스, 햄버거]을 이미 골랐고,이 음식들과 완전히 같지는 않지만 비슷한 취향의 사람들이 좋아할 만한 다른 음식을 1개 추천해줘.절대로 중복되면 안돼. 그리고 답을 줄때는 음식이름만 줘",
          },
          {
            role: "user",
            content: `사용자가 선택한 음식: ${selectedFoods.join(", ")}`,
          },
        ],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content ?? "";

  
    return aiText.split(",").map((item: string) => item.trim());
  }
  