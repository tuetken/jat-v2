import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Sign in to JAT
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Track your job applications efficiently
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
        </span>
        <Link
          href="/signup"
          className="font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
