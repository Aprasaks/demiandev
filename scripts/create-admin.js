// scripts/create-admin.js
import { createClient } from '@supabase/supabase-js'

// service_role 키를 환경 변수에 넣어두세요 (절대 브라우저에 노출 금지!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAdmin() {
  const { user, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'heavenin24@naver.com',
    password: '0113Aprasaks@',
    email_confirm: true,       // 이메일 확인 일단 생략
    user_metadata: { role: 'admin' },
  })
  if (error) {
    console.error('관리자 생성 실패:', error)
  } else {
    console.log('관리자 생성 완료:', user)
  }
}

createAdmin()