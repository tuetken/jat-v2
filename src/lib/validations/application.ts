/**
 * JAT v2 - Application Validation Schemas
 * Zod schemas for validating application form data
 */

import { z } from 'zod';

/**
 * Valid application status values
 */
export const applicationStatuses = [
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn',
] as const;

/**
 * Zod schema for creating a new application
 * 
 * Validates:
 * - company_name: required, non-empty string
 * - position_title: required, non-empty string
 * - application_date: required, valid date string in YYYY-MM-DD format
 * - status: required, must be one of the valid status enum values
 * - notes: optional string, can be empty or null
 * 
 * Does NOT include user_id - this is set server-side from auth context
 */
export const createApplicationSchema = z.object({
  company_name: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters')
    .trim(),
  
  position_title: z
    .string()
    .min(1, 'Position title is required')
    .max(200, 'Position title must be less than 200 characters')
    .trim(),
  
  application_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date'),
  
  status: z.enum(applicationStatuses, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
  
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .transform((val) => val && val.trim() === '' ? null : val),
});

/**
 * Type inference from the create schema
 */
export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;

/**
 * Zod schema for updating an existing application
 * 
 * All fields are optional since PATCH allows partial updates.
 * Validates:
 * - company_name: optional, non-empty string if provided
 * - position_title: optional, non-empty string if provided
 * - application_date: optional, valid date string in YYYY-MM-DD format if provided
 * - status: optional, must be one of the valid status enum values if provided
 * - notes: optional string, can be empty or null
 * 
 * Does NOT include user_id - ownership is validated by RLS
 */
export const updateApplicationSchema = z.object({
  company_name: z
    .string()
    .min(1, 'Company name cannot be empty')
    .max(200, 'Company name must be less than 200 characters')
    .trim()
    .optional(),
  
  position_title: z
    .string()
    .min(1, 'Position title cannot be empty')
    .max(200, 'Position title must be less than 200 characters')
    .trim()
    .optional(),
  
  application_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date')
    .optional(),
  
  status: z.enum(applicationStatuses, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }).optional(),
  
  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .transform((val) => val && val.trim() === '' ? null : val),
});

/**
 * Type inference from the update schema
 */
export type UpdateApplicationFormData = z.infer<typeof updateApplicationSchema>;
