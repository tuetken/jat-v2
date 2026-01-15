import { getApplications } from '@/lib/db/applications'
import { ApplicationList } from '@/components/applications/ApplicationList'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { RefreshButton } from '@/components/ui/RefreshButton'

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <svg
              className="h-12 w-12 text-red-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-900">
              Unable to Load Applications
            </h3>
            <p className="text-sm text-red-800">
              We&apos;re having trouble loading your applications. Please refresh the page or try again later.
            </p>
            <RefreshButton />
          </div>
        </div>
      </div>
    )
  }

  const applications = result.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
          <Link href="/applications/new">
            <Button className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors">
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
