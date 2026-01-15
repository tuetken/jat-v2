/**
 * Loading state for the dashboard page.
 * Displays skeleton UI while data is being fetched.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-9 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
