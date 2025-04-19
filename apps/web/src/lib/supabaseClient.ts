// apps/web/src/lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL    // 빌드(서버) 환경에서
  ?? process.env.NEXT_PUBLIC_SUPABASE_URL; // 클라이언트 환경에서

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
