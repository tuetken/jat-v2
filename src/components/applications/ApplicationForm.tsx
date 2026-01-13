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
import { createApplicationSchema, type CreateApplicationFormData } from '@/lib/validations/application'
import { createApplicationAction } from '@/app/(auth)/actions'
import { useState } from 'react'

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
  } = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      company_name: '',
      position_title: '',
      application_date: new Date().toISOString().split('T')[0], // Default to today
      status: 'applied',
      notes: '',
    },
  })

  const onSubmit = async (data: CreateApplicationFormData) => {
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
        setServerError(result.error)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setServerError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error Display */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{serverError}</p>
        </div>
      )}

      {/* Company Name */}
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          id="company_name"
          type="text"
          {...register('company_name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
        )}
      </div>

      {/* Position Title */}
      <div>
        <label htmlFor="position_title" className="block text-sm font-medium text-gray-700 mb-1">
          Position Title *
        </label>
        <input
          id="position_title"
          type="text"
          {...register('position_title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.position_title && (
          <p className="mt-1 text-sm text-red-600">{errors.position_title.message}</p>
        )}
      </div>

      {/* Application Date */}
      <div>
        <label htmlFor="application_date" className="block text-sm font-medium text-gray-700 mb-1">
          Application Date *
        </label>
        <input
          id="application_date"
          type="date"
          {...register('application_date')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        {errors.application_date && (
          <p className="mt-1 text-sm text-red-600">{errors.application_date.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Application'}
        </button>
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
