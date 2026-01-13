import { getApplications } from '@/lib/db/applications'
import { ApplicationList } from '@/components/applications/ApplicationList'

/**
 * Dashboard page - displays read-only list of user's job applications.
 * Server Component that fetches data using the authenticated data access layer.
 */
export default async function DashboardPage() {
  const result = await getApplications()

  // Handle error state
  if (!result.success) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load applications: {result.error}
          </p>
        </div>
      </div>
    )
  }

  const applications = result.data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </p>
      </div>

      {/* Applications List */}
      <ApplicationList applications={applications} />
    </div>
  )
}
