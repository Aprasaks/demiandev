// src/app/simple/page.jsx
import { redirect } from "next/navigation";

export default function SimpleIndexPage() {
  // 기본 테이블을 posts로 지정
  redirect("/simple/posts");
}