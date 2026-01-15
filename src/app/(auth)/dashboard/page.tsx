import { getApplications } from '@/lib/db/applications'
import { ApplicationList } from '@/components/applications/ApplicationList'
import Link from 'next/link'
import { Button } from '@/components/ui'

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
          <Link href="/applications/new">
            <Button className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg">
              Create New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <ApplicationList applications={applications} />
    </div>
  )
}
