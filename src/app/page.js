// app/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [answered, setAnswered] = useState(false);

  return (
    <main className="
      h-screen flex 
      items-center justify-center 
      bg-white text-black 
      dark:bg-black dark:text-white
    ">
      {/* 내부 래퍼: flex 컬럼으로 가로/세로 중앙 */}
      <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">
        {/* 1) 질문 화면 */}
        {!answered && (
          <motion.h1
            className="text-6xl font-aggro cursor-pointer select-none 
                       text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setAnswered(true)}
          >
            공부가 힘드신가요?
          </motion.h1>
        )}

        <AnimatePresence>
          {/* 2) 결과 화면 */}
          {answered && (
            <motion.div
              key="result"
              className="mt-4" // 질문과 결과 사이 간격
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="text-6xl font-aggro 
                           text-black dark:text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                어제보다 오늘 더 나아지고 있어요.
              </motion.p>

              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}