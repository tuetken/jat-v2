import Link from 'next/link'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Start tracking your job applications today
        </p>
      </div>

      <SignupForm />

      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
        </span>
        <Link
          href="/login"
          className="font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
