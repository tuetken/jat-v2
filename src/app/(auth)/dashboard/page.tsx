import { getApplications } from '@/lib/db/applications'
import { ApplicationList } from '@/components/applications/ApplicationList'
import Link from 'next/link'

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
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
          <Link
            href="/applications/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create New Application
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <ApplicationList applications={applications} />
    </div>
  )
}
