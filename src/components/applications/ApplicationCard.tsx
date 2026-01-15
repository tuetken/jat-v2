import type { Application } from '@/lib/types'

/**
 * Server Component that displays a single job application in a card format.
 * Read-only view with no interaction.
 */
interface ApplicationCardProps {
  application: Application
}

// Helper function to format status for display
function formatStatus(status: Application['status']): string {
  const statusMap: Record<Application['status'], string> = {
    applied: 'Applied',
    interviewing: 'Interviewing',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  }
  return statusMap[status]
}

// Helper function to get status color
function getStatusColor(status: Application['status']): string {
  const colorMap: Record<Application['status'], string> = {
    applied: 'bg-blue-100 text-blue-800',
    interviewing: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  }
  return colorMap[status]
}

// Helper function to format date
// Parse "YYYY-MM-DD" as local date to avoid timezone offset issues
function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start gap-4">
        {/* Main Content */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {application.position_title}
            </h3>
            <p className="text-sm text-gray-600">
              {application.company_name}
            </p>
          </div>

          {/* Application Date */}
          <p className="text-sm text-gray-500">
            Applied: {formatDate(application.application_date)}
          </p>

          {/* Notes (if any) */}
          {application.notes && (
            <p className="text-sm text-gray-700 mt-3">
              {application.notes}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              application.status
            )}`}
          >
            {formatStatus(application.status)}
          </span>
        </div>
      </div>
    </div>
  )
}
