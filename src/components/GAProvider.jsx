// src/components/GAProvider.jsx
"use client";

import Script from "next/script";

export default function GAProvider({ gaId }) {
  if (!gaId) return null;
  return (
    <>
      {/* 구글 애널리틱스 스크립트 삽입 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}