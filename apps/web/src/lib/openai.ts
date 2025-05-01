// src/lib/openai.ts
// DOCORE: OpenAI API를 통해 사용자 선호도를 기반으로 음식 추천 호출

export async function fetchAdditionalRecommendations(
  selectedFoods: string[],
  dislikedFoods: string[]
): Promise<string[]> {
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
          content: `당신은 사용자의 음식 취향을 분석하여 "왠지 좋아 할 것 같은 새로운 음식"을 추천하는 역할입니다. 
                    다만, 아래 "싫어요한 음식"은 절대 추천하지 마세요. 
                    반드시 음식 이름만 한 줄로, 쉼표 없이 단일 결과만 보내주세요.`,
        },
        {
          role: "user",
          content: `사용자가 선택한 음식: ${selectedFoods.join(", ")}\n싫어요한 음식: ${dislikedFoods.join(", ")}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const aiText = data.choices?.[0]?.message?.content ?? "";

  return aiText
    .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]/g, "")
    .split(/[\n,]/)
    .map((item: string) => item.trim())
    .filter(Boolean);
}

export async function fetchInitialCategorySuggestions(mealType: string): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API 키가 없습니다.");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
          content: "당신은 사용자의 상황에 맞는 한식 메뉴 카테고리를 추천하는 AI입니다. 추천할 수 있는 음식 이름을 1줄에 1개씩 20개만 제시해주세요. 형식은 순수한 음식 이름만, 쉼표 없이.",
        },
        {
          role: "user",
          content: `현재 시간대: ${mealType} 시간대입니다. 이 시간에 어울리는 음식 추천해주세요.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  return text.split("\n").map(line => line.trim()).filter(Boolean);
}