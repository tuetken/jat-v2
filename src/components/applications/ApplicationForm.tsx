'use client'

/**
 * JAT v2 - Application Form Component
 * 
 * Client Component that handles form state and submission.
 * Uses react-hook-form with Zod validation for client-side validation.
 * Submits to Server Action for server-side validation and persistence.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createApplicationSchema } from '@/lib/validations/application'
import { createApplicationAction } from '@/app/(auth)/actions'
import { useState } from 'react'
import { Button, Input, Select, Textarea, Label } from '@/components/ui'
import { z } from 'zod'

// Form values type - input type before Zod transform
type ApplicationFormValues = z.input<typeof createApplicationSchema>

/**
 * ApplicationForm - Client Component for creating new job applications
 * 
 * Features:
 * - Client-side validation with Zod
 * - Server Action submission
 * - Error handling and display
 * - Loading states
 */
export function ApplicationForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      company_name: '',
      position_title: '',
      application_date: new Date().toISOString().split('T')[0], // Default to today
      status: 'applied' as const,
      notes: '',
    },
  })

  const onSubmit = async (data: ApplicationFormValues) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      // Convert to FormData for Server Action
      const formData = new FormData()
      formData.append('company_name', data.company_name)
      formData.append('position_title', data.position_title)
      formData.append('application_date', data.application_date)
      formData.append('status', data.status)
      if (data.notes) {
        formData.append('notes', data.notes)
      }

      // Call Server Action - will redirect on success
      const result = await createApplicationAction(formData)

      // If we reach here, there was an error (redirect prevents this on success)
      if (result && !result.success) {
        // Translate technical errors to user-friendly messages
        const userFriendlyError = 
          result.error.toLowerCase().includes('authentication') ||
          result.error.toLowerCase().includes('not authenticated')
            ? 'Your session has expired. Please refresh the page and sign in again.'
            : result.error.toLowerCase().includes('validation')
            ? 'Please check all fields and try again.'
            : result.error.toLowerCase().includes('network') ||
              result.error.toLowerCase().includes('connection')
            ? 'Unable to save. Please check your internet connection and try again.'
            : 'Unable to save application. Please try again or contact support if the problem persists.'
        
        setServerError(userFriendlyError)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setServerError('Unable to connect. Please check your internet connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error Display */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert" aria-live="polite">
          <p className="text-red-800 text-sm">{serverError}</p>
        </div>
      )}

      {/* Company Name */}
      <div>
        <Label htmlFor="company_name" className="mb-1 text-gray-700 dark:text-gray-700">
          Company Name *
        </Label>
        <Input
          id="company_name"
          type="text"
          {...register('company_name')}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-300 dark:bg-white dark:text-zinc-900"
          disabled={isSubmitting}
          autoFocus
          hasError={!!errors.company_name}
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
        )}
      </div>

      {/* Position Title */}
      <div>
        <Label htmlFor="position_title" className="mb-1 text-gray-700 dark:text-gray-700">
          Position Title *
        </Label>
        <Input
          id="position_title"
          type="text"
          {...register('position_title')}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-300 dark:bg-white dark:text-zinc-900"
          disabled={isSubmitting}
          hasError={!!errors.position_title}
        />
        {errors.position_title && (
          <p className="mt-1 text-sm text-red-600">{errors.position_title.message}</p>
        )}
      </div>

      {/* Application Date */}
      <div>
        <Label htmlFor="application_date" className="mb-1 text-gray-700 dark:text-gray-700">
          Application Date *
        </Label>
        <Input
          id="application_date"
          type="date"
          {...register('application_date')}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-300 dark:bg-white dark:text-zinc-900"
          disabled={isSubmitting}
          max={new Date().toISOString().split('T')[0]}
          hasError={!!errors.application_date}
        />
        {errors.application_date && (
          <p className="mt-1 text-sm text-red-600">{errors.application_date.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status" className="mb-1 text-gray-700 dark:text-gray-700">
          Status *
        </Label>
        <Select
          id="status"
          {...register('status')}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-300 dark:bg-white dark:text-zinc-900"
          disabled={isSubmitting}
          hasError={!!errors.status}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </Select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="mb-1 text-gray-700 dark:text-gray-700">
          Notes <span className="text-gray-500 font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          {...register('notes')}
          rows={4}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-300 dark:bg-white dark:text-zinc-900"
          disabled={isSubmitting}
          hasError={!!errors.notes}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg"
        >
          {isSubmitting ? 'Creating...' : 'Create Application'}
        </Button>
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            if (isSubmitting) {
              e.preventDefault()
            }
          }}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
