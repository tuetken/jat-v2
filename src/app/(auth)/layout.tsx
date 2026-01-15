import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { LogoutButton } from '@/components/auth/LogoutButton'

function AuthLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </main>
    </div>
  )
}

/**
 * Layout for authenticated routes.
 * Provides navigation, user info, and logout functionality.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // This layout is only for authenticated users
  // Middleware should catch this, but double-check here
  if (!user) {
    redirect('/login')
  }

  return (
    <Suspense fallback={<AuthLayoutSkeleton />}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* App Title */}
              <div className="flex items-center">
                <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
                  Job Application Tracker
                </Link>
              </div>

              {/* User Info and Logout */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <div className="relative">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </Suspense>
  )
}
