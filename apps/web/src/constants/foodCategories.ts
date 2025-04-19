// DOCORE: "밥 뭐먹지?" - 음식 카테고리 리스트 & 키워드 매핑

export const foodRounds = [
    ["국밥", "햄버거", "돈까스", "떡볶이", "초밥"],
    ["치킨", "스테이크", "라멘", "파스타", "삼겹살"],
    ["샐러드", "쌀국수", "피자", "카레", "곱창"],
  ];
  
  export const foodKeywordMap: Record<string, string> = {
    국밥: "gukbap",
    햄버거: "burger",
    돈까스: "tonkatsu",
    떡볶이: "tteokbokki",
    초밥: "sushi",
    치킨: "fried chicken",
    스테이크: "steak",
    라멘: "ramen",
    파스타: "pasta",
    삼겹살: "samgyeopsal",
    샐러드: "salad",
    쌀국수: "pho",
    피자: "pizza",
    카레: "curry",
    곱창: "gopchang",
  };
  