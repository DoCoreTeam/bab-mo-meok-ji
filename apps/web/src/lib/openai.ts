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
          content: `다음 음식들과 비슷한 취향이지만 완전히 같지 않은 다른 음식 이름 하나만 추천해주세요. 
                    음식 이름만 반환하고 문장, 설명, 숫자 등은 절대 포함하지 마세요. 
                    이미 추천한 음식은 제외해야 하고, 항상 새로운 것을 추천해주세요.`,
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

  return aiText
    .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9,\\s-]/g, "") // 특수문자 제거
    .split(",")
    .map((item: string) => item.trim())
    .filter(Boolean);
}