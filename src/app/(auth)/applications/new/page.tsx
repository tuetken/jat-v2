import { ApplicationForm } from '@/components/applications/ApplicationForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * New Application Page
 * 
 * Server Component that:
 * - Verifies authentication before rendering
 * - Displays the ApplicationForm for creating new applications
 * 
 * Security: Authentication is enforced by middleware, but we verify again
 * to ensure user context is available. The form submission uses Server Actions
 * with server-side validation and RLS enforcement.
 */
export default async function NewApplicationPage() {
  // Verify authentication
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Application</h1>
        <p className="mt-2 text-gray-600">
          Add a new job application to track your progress.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ApplicationForm />
      </div>
    </div>
  )
}
