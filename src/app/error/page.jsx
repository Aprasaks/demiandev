// src/app/error/page.jsx
import { createClient } from "@supabase/supabase-js";
import ErrorTable from "@/components/ErrorTable";

export default async function ErrorPage() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  

     const { data: errors, error } = await supabase
       .from("error")
       .select("id, title, created_at")
       .order("created_at", { ascending: false });

       if (error) {
        return <p>에러 로그를 불러오는 중 문제가 발생했습니다.</p>;
      }
    
      return (
        <main className="p-8 bg-white dark:bg-black min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            오류를 찾아봅시다
          </h1>
          <ErrorTable errors={errors} />
    </main>
  );
}