import type { Application } from '@/lib/types'
import { ApplicationCard } from './ApplicationCard'

/**
 * Server Component that renders a list of job applications.
 * Displays an empty state if no applications exist.
 */
interface ApplicationListProps {
  applications: Application[]
}

export function ApplicationList({ applications }: ApplicationListProps) {
  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="max-w-sm mx-auto space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No applications yet
          </h3>
          <p className="text-sm text-gray-600">
            Get started by tracking your first job application. Click the &quot;Create New Application&quot; button above to begin.
          </p>
        </div>
      </div>
    )
  }

  // List of applications
  return (
    <div className="space-y-4 animate-fade-in">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  )
}
