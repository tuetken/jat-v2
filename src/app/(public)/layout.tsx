import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JAT - Job Application Tracker',
  description: 'Track your job applications efficiently',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
