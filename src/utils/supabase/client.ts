
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "CRITICAL_CONFIG_ERROR: Supabase URL or Anon Key is missing from environment variables. " +
      "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set. " +
      "Check your Vercel project settings (Environment Variables section) or your local .env.local file. " +
      "The application cannot connect to Supabase without these."
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
