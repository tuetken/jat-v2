import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for client-side operations.
 * 
 * CRITICAL: This client should ONLY be used for authentication operations:
 * - Login
 * - Signup
 * - Logout
 * - Password reset
 * 
 * All data access should use Server Components with the server-side client
 * to ensure RLS policies are properly enforced.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
