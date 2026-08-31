import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://keaxuybyexjmmcmnoboc.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZryYcsj4MBD7Bm_amC6KSw_Gon5Flzl';

  return createBrowserClient(url, anonKey);
}
