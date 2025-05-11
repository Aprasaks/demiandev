"use client";

export default function Home() {
  return (
    <main className="h-screen">
      <section className="flex h-full items-center justify-center px-8">
        <div className="flex flex-col items-center justify-center text-center w-full max-w-5xl">
          
          {/* 이 wrapper에 높이만큼 위로 이동 */}
          <div className="relative -top-8 space-y-2">
            <h1 className="text-sm text-gray-700 dark:text-gray-400 font-bold">
              공부가 힘드신가요?
            </h1>
            <h1 className="text-3xl text-gray-900 dark:text-gray-200 font-bold">
              걱정하지 마세요.
            </h1>
          </div>

          {/* 서브 텍스트는 그대로 중앙 */}
          <p className="mt-8 text-5xl font-cafe text-gray-900 dark:text-white">
            오늘의 한걸음은 내일의 그림자가 되어줄 테니까요.
          </p>
        </div>
      </section>
    </main>
  );
}