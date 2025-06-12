
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    let errorDetails = "";
    if (!supabaseUrl) {
      errorDetails += "NEXT_PUBLIC_SUPABASE_URL is missing or empty. ";
    }
    if (!supabaseAnonKey) {
      errorDetails += "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty. ";
    }
    throw new Error(
      "CRITICAL_CONFIG_ERROR: Supabase client initialization failed. " + errorDetails +
      "Please ensure these environment variables are correctly set in your Vercel project settings (Environment Variables section) and that the project has been redeployed. " +
      "The application cannot connect to Supabase without these. " +
      "Expected URL format: https://<your-project-ref>.supabase.co. " +
      "Expected Anon Key format: a long JWT string."
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
