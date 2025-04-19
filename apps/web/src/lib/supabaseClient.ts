// apps/web/src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 1) 서버 전용 env 이름
const supabaseUrl   = process.env.SUPABASE_URL   ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey   = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2) 둘 다 없으면 빌드 시점에 에러
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase 환경변수가 설정되지 않았습니다. " +
    "SUPABASE_URL 및 SUPABASE_ANON_KEY 또는 NEXT_PUBLIC_* 값이 필요합니다."
  );
}

// 3) 클라이언트·서버 공통으로 사용 가능한 supabase 인스턴스
export const supabase = createClient(supabaseUrl, supabaseKey);
