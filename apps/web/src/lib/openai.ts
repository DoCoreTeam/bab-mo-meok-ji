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
            content: "당신은 음식 추천 전문가입니다. 사용자가 좋아할 만한 비슷한 음식을 5개 추천해주세요. 결과는 음식 이름만 콤마로 구분해서 주세요.",
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
  