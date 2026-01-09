/**
 * JAT v2 - TypeScript Types
 * Aligned with Supabase database schema
 */

// Application status enum matching database enum
export type ApplicationStatus = 
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

// Application type matching database schema
export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  status: ApplicationStatus;
  application_date: string; // ISO date string (YYYY-MM-DD)
  notes: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Type for creating a new application (omits auto-generated fields)
export type CreateApplicationInput = Omit<
  Application,
  'id' | 'created_at' | 'updated_at'
>;

// Type for updating an application (all fields optional except id)
export type UpdateApplicationInput = Partial<
  Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

// Database response type for Supabase queries
export type DatabaseApplication = Application;

// Helper type for application form data (excludes user_id as it's set server-side)
export type ApplicationFormData = Omit<
  CreateApplicationInput,
  'user_id'
>;
