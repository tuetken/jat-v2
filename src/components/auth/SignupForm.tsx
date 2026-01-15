'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Label } from '@/components/ui'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) {
        // Translate technical Supabase errors to user-friendly messages
        const userFriendlyMessage = 
          signUpError.message.toLowerCase().includes('already registered') ||
          signUpError.message.toLowerCase().includes('already exists')
            ? 'This email is already registered. Please sign in instead.'
            : signUpError.message.toLowerCase().includes('password')
            ? 'Password does not meet requirements. Please use a stronger password.'
            : signUpError.message.toLowerCase().includes('email')
            ? 'Please enter a valid email address.'
            : signUpError.message.toLowerCase().includes('too many requests')
            ? 'Too many signup attempts. Please wait a few minutes and try again.'
            : 'Unable to create account. Please try again later.'
        
        setError(userFriendlyMessage)
        return
      }

      // Check if email confirmation is required
      // If session exists, user is logged in (confirmation disabled or auto-confirmed)
      // If no session, email confirmation is required
      if (authData.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setNeedsEmailConfirmation(true)
      }
    } catch (err) {
      setError('Unable to connect. Please check your internet connection and try again.')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (needsEmailConfirmation) {
    return (
      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20" role="status" aria-live="polite">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Check your email
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                We&apos;ve sent you an email with a confirmation link. Please check your inbox and click the link to activate your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register('email')}
          type="email"
          id="email"
          autoComplete="email"
          autoFocus
          className="mt-1"
          placeholder="you@example.com"
          hasError={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          {...register('password')}
          type="password"
          id="password"
          autoComplete="new-password"
          className="mt-1"
          placeholder="••••••••"
          hasError={!!errors.password}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          className="mt-1"
          placeholder="••••••••"
          hasError={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20" role="alert" aria-live="polite">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
