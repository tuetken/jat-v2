/**
 * Loading state for the new application page.
 * Displays skeleton UI while the form is being prepared.
 */
export default function NewApplicationLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="h-9 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
