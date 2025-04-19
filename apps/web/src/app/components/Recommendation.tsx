// src/components/Recommendation.tsx
import React from "react";
import Map from "./Map";

interface RecommendationProps {
  selectedPlace: any;
  onAnotherRecommendation: () => void;
  onRestart: () => void;
}

const Recommendation: React.FC<RecommendationProps> = ({
  selectedPlace,
  onAnotherRecommendation,
  onRestart,
}) => {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="mb-6 w-full">
        <Map lat={selectedPlace.lat} lng={selectedPlace.lng} />
      </div>
      <div className="text-center">
        <button
          className="text-2xl font-semibold mb-2 underline"
          onClick={() =>
            window.open(
              `https://place.map.kakao.com/${selectedPlace.kakaoId}`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          {selectedPlace.kakaoName}
        </button>
        <p className="text-gray-600 mb-2">🍴 {selectedPlace.category}</p>
        <p className="text-gray-600 mb-4">
          ⭐ {selectedPlace.rating} / {selectedPlace.address}
        </p>
        <button
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          onClick={onAnotherRecommendation}
        >
          다른 추천 보기
        </button>
        <button
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
          onClick={onRestart}
        >
          선호도 다시 설정
        </button>
      </div>
    </div>
  );
};

export default Recommendation;
