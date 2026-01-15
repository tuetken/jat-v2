/**
 * JAT v2 - Data Access Layer for Application Insights
 * 
 * CRITICAL SECURITY NOTES:
 * - All functions use the authenticated Supabase server client
 * - User identity is derived from server-side auth context (cookies/session)
 * - Row Level Security (RLS) policies automatically scope queries to auth.uid()
 * - Functions DO NOT accept user_id as a parameter - RLS handles authorization
 * - All queries are read-only aggregations for analytics purposes
 * 
 * SCOPE NOTE:
 * These are foundational helper functions that return UI-agnostic structured data.
 * No UI components, routes, or visualizations are included in Phase 7.
 */

import { createClient } from '@/lib/supabase/server';
import type { ApplicationStatus } from '@/lib/types';

/**
 * Result type for data access operations
 */
type DataResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Type for status count aggregation
 */
export interface StatusCount {
  status: ApplicationStatus;
  count: number;
}

/**
 * Type for date-grouped application counts (time series)
 */
export interface DateCount {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number;
}

/**
 * Type for total application count
 */
export interface TotalCount {
  total: number;
}

/**
 * Counts total applications for the authenticated user.
 * 
 * RLS policies automatically filter results to user_id = auth.uid().
 * 
 * @returns Promise with typed result containing total count or error
 */
export async function getTotalApplicationCount(): Promise<DataResult<TotalCount>> {
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

    // Count applications - RLS automatically filters by user_id
    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting applications:', error);
      return {
        success: false,
        error: `Failed to count applications: ${error.message}`
      };
    }

    return {
      success: true,
      data: { total: count ?? 0 }
    };
  } catch (error) {
    console.error('Unexpected error in getTotalApplicationCount:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while counting applications'
    };
  }
}

/**
 * Counts applications grouped by status for the authenticated user.
 * 
 * RLS policies automatically filter results to user_id = auth.uid().
 * Returns an array of status counts, one entry per status that has applications.
 * Statuses with zero applications are not included in the results.
 * 
 * @returns Promise with typed result containing status counts array or error
 */
export async function getApplicationCountsByStatus(): Promise<DataResult<StatusCount[]>> {
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

    // Fetch all applications and group by status client-side
    // Note: Supabase doesn't support GROUP BY directly, so we aggregate in-memory
    // RLS automatically filters by user_id
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status');

    if (error) {
      console.error('Error fetching applications for status count:', error);
      return {
        success: false,
        error: `Failed to fetch applications: ${error.message}`
      };
    }

    // Aggregate counts by status
    const statusCounts = (applications ?? []).reduce((acc, app) => {
      const status = app.status as ApplicationStatus;
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    // Convert to array format
    const result: StatusCount[] = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as ApplicationStatus,
      count
    }));

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Unexpected error in getApplicationCountsByStatus:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching status counts'
    };
  }
}

/**
 * Counts applications grouped by application_date for the authenticated user.
 * 
 * RLS policies automatically filter results to user_id = auth.uid().
 * Returns an array of date counts, ordered by date ascending (oldest to newest).
 * This provides basic time series data for visualizing application trends over time.
 * 
 * @returns Promise with typed result containing date counts array or error
 */
export async function getApplicationCountsByDate(): Promise<DataResult<DateCount[]>> {
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

    // Fetch all applications and group by date client-side
    // RLS automatically filters by user_id
    const { data: applications, error } = await supabase
      .from('applications')
      .select('application_date');

    if (error) {
      console.error('Error fetching applications for date count:', error);
      return {
        success: false,
        error: `Failed to fetch applications: ${error.message}`
      };
    }

    // Aggregate counts by date
    const dateCounts = (applications ?? []).reduce((acc, app) => {
      const date = app.application_date;
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format and sort by date ascending
    const result: DateCount[] = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Unexpected error in getApplicationCountsByDate:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while fetching date counts'
    };
  }
}
