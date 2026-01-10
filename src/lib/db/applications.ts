/**
 * JAT v2 - Data Access Layer for Applications
 * 
 * CRITICAL SECURITY NOTES:
 * - All functions use the authenticated Supabase server client
 * - User identity is derived from server-side auth context (cookies/session)
 * - Row Level Security (RLS) policies automatically scope queries to auth.uid()
 * - Functions DO NOT accept user_id as a parameter - RLS handles authorization
 * - Client cannot manipulate data ownership or access other users' data
 */

import { createClient } from '@/lib/supabase/server';
import type { Application } from '@/lib/types';

/**
 * Result type for data access operations
 */
type DataResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Fetches all applications for the authenticated user.
 * 
 * RLS policies automatically filter results to user_id = auth.uid().
 * Returns applications ordered by created_at descending (newest first).
 * 
 * @returns Promise with typed result containing applications array or error
 */
export async function getApplications(): Promise<DataResult<Application[]>> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Query applications - RLS automatically filters by user_id
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return {
        success: false,
        error: `Failed to fetch applications: ${error.message}`
      };
    }

    return {
      success: true,
      data: data as Application[]
    };
  } catch (error) {
    console.error('Unexpected error in getApplications:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching applications'
    };
  }
}

/**
 * Fetches a single application by ID for the authenticated user.
 * 
 * RLS policies automatically verify that the application belongs to auth.uid().
 * If the application doesn't exist or doesn't belong to the user, returns null.
 * 
 * @param id - The UUID of the application to fetch
 * @returns Promise with typed result containing application or error
 */
export async function getApplicationById(
  id: string
): Promise<DataResult<Application | null>> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const applicationId = typeof id === 'string' ? id.trim() : '';
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      // Validate ID format (basic UUID check)
      if (!applicationId || !UUID_RE.test(applicationId)) {
      return {
        success: false,
        error: 'Invalid application ID'
      };
    }

    // Query single application - RLS automatically filters by user_id
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching application:', error);
      return {
        success: false,
        error: `Failed to fetch application: ${error.message}`
      };
    }

    return {
      success: true,
      data: data as Application | null
    };
  } catch (error) {
    console.error('Unexpected error in getApplicationById:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching the application'
    };
  }
}
