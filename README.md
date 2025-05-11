# DEMIAN Blog

Next.js 15, Tailwind CSS, Supabase, 그리고 Tiptap을 이용해 만들었다. 
아무런 외부 라이브러리 없이 순수 React 컴포넌트와 Supabase만으로 구현한 “스크래치”형 블로그 구조이다.


---

##  주요 기능

- **글 작성 & 관리**  
  - `/simple` 경로에서 Rich-text 에디터(Tiptap)를 활용해 글을 작성  
  - Supabase `posts` 테이블에 HTML 콘텐츠 저장  
  - `/posts` 페이지에서 작성된 글 목록(제목/날짜) 자동 조회  
  - 개별 글 보기(`/posts/[id]`) 지원  

- **인증 & 권한**  
  - Supabase Auth를 활용한 관리자 로그인  
  - 로그인한 관리자만 글 작성(Write) 메뉴 표시 및 접근 가능  
  - 로그인/로그아웃 토글과 모달형 로그인 UI  

- **다크/라이트 모드**  
  - 전역 토글 버튼으로 다크↔라이트 모드 전환  
  - Tiptap 툴바 안에서도 에디터 전용 다크 모드 버튼 제공  


---

## 🏗️ 기술 스택

| 역할         | 라이브러리 / 툴                                |
|--------------|----------------------------------------------|
| Frontend     | Next.js 15 (App Router), React 18            |
| Styling      | Tailwind CSS, SCSS                           |
| Rich-text    | Tiptap (StarterKit, 코드블록, 이미지 업로드 등) |
| Auth & DB    | Supabase (Auth, Postgres, Storage)           |
| 배포         | Vercel (or Netlify)                          |

---

