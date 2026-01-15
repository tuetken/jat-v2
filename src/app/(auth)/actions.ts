'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createApplication } from '@/lib/db/applications'
import { createApplicationSchema } from '@/lib/validations/application'

/**
 * Server action to log out the current user.
 * Called from the logout form in the auth layout.
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Server action to create a new application.
 * 
 * Security:
 * - Validates input using Zod schema
 * - Authenticates user server-side (never accepts user_id from client)
 * - Uses data access layer with RLS enforcement
 * - Redirects to dashboard on success
 * 
 * @param formData - Raw FormData from the client form submission
 * @returns Result object with success status and error message if applicable
 */
export async function createApplicationAction(formData: FormData) {
  // Verify authentication
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return {
      success: false,
      error: 'User not authenticated'
    }
  }

  // Extract form data
  const rawData = {
    company_name: formData.get('company_name'),
    position_title: formData.get('position_title'),
    application_date: formData.get('application_date'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  }

  // Validate using Zod schema
  const validation = createApplicationSchema.safeParse(rawData)
  
  if (!validation.success) {
    const firstError = validation.error.issues[0]
    return {
      success: false,
      error: firstError?.message || 'Validation failed'
    }
  }

  // Create application using data access layer (RLS enforced)
  const result = await createApplication(validation.data)

  if (!result.success) {
    return {
      success: false,
      error: result.error
    }
  }

  // Redirect to dashboard on success
  redirect('/dashboard')
}
