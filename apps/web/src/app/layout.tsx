// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GTM_ID } from "@/lib/gtm"; // ✅ 추가

export const metadata: Metadata = {
  title: "밥 뭐먹지?",
  description: "매일 메뉴 추천 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ Kakao Map SDK */}
        <Script
          id="kakao-map-sdk"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive"
        />

        {/* ✅ Google AdSense */}
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5059503509737581"
          crossOrigin="anonymous"
          async
        />
        <meta name="google-adsense-account" content="ca-pub-5059503509737581" />

        {/* ✅ Google Tag Manager 스크립트 */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </head>
      <body
        className={
          "min-h-screen " +
          "bg-[var(--background)] text-[var(--foreground)] " +
          "transition-colors duration-300"
        }
      >
        {/* ✅ noscript용 iframe (GTM 백업용) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}

        {children}
      </body>
    </html>
  );
}
