'use client'

/**
 * Client Component for page refresh action.
 * Encapsulates client-side onClick behavior for use in Server Components.
 */
export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 font-medium transition-colors"
    >
      Refresh Page
    </button>
  )
}
