
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

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
      "CRITICAL_CONFIG_ERROR: Supabase server client initialization failed. " + errorDetails +
      "Please ensure these environment variables are correctly set in your Vercel project settings (Environment Variables section) and that the project has been redeployed. " +
      "The application cannot connect to Supabase without these. " +
      "Expected URL format: https://<your-project-ref>.supabase.co. " +
      "Expected Anon Key format: a long JWT string."
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options }) // Changed to set empty value, remove can be problematic
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
