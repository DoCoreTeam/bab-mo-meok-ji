// DOCORE: 2025-04-20 17:55 window.printDislikedFoods 타입 선언 추가
export {};

declare global {
  interface Window {
    printDislikedFoods: () => void;
  }
}
