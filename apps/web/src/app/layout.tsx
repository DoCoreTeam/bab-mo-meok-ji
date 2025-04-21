// // apps/web/src/app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "밥 뭐먹지?",
//   description: "매일 점심 메뉴 추천 서비스",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="ko">
//       <head>
//         <Script
//           id="kakao-map-sdk"
//           src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
//           strategy="beforeInteractive"
//         />
//       </head>
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}>
//         {children}
//       </body>
//     </html>
//   );
// }

// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";


export const metadata: Metadata = {
  title: "밥 뭐먹지?",
  description: "매일 점심 메뉴 추천 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Kakao Map SDK */}
        <Script
          id="kakao-map-sdk"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive"
        />
        {/* AdSense 코드 스니펫 */}
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059503509737581"
          crossOrigin="anonymous"
          async
        />
        <meta name="google-adsense-account" content="ca-pub-5059503509737581"></meta>
      </head>
      <body
        className={
          "min-h-screen " +
          "bg-[var(--background)] text-[var(--foreground)] " +
          "transition-colors duration-300"
        }
      >
        {children}
      </body>
    </html>
  );
}
