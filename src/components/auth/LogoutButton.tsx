'use client'

import { useState } from 'react'
import { logout } from '@/app/(auth)/actions'

/**
 * Client Component for logout functionality with error handling.
 * Provides loading state and error feedback to users.
 */
export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await logout()
      // If logout succeeds, the server action will redirect to /login
      // If we reach here, there might be an issue
    } catch (err) {
      setError('Unable to sign out. Please try again.')
      console.error('Logout error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing out...' : 'Logout'}
      </button>
      {error && (
        <div className="absolute top-full right-0 mt-2 bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-800 whitespace-nowrap shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
