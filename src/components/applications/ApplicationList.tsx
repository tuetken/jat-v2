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
        <div className="max-w-sm mx-auto space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            No applications yet
          </h3>
          <p className="text-sm text-gray-600">
            You haven't tracked any job applications yet. Your applications will appear here once you add them.
          </p>
        </div>
      </div>
    )
  }

  // List of applications
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  )
}
