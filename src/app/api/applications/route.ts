/**
 * JAT v2 - Applications API Route
 * POST /api/applications - Create new application
 * 
 * SECURITY:
 * - User identity derived from server-side Supabase auth
 * - RLS policies enforce data ownership at database level
 * - User cannot manipulate user_id or access other users' data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApplication } from '@/lib/db/applications';
import { createApplicationSchema } from '@/lib/validations/application';
import { ZodError } from 'zod';

/**
 * POST /api/applications
 * Creates a new application for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createApplicationSchema.parse(body);

    // Create application via data access layer
    const result = await createApplication({
      company_name: validatedData.company_name,
      position_title: validatedData.position_title,
      application_date: validatedData.application_date,
      status: validatedData.status,
      notes: validatedData.notes ?? null,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: result.data },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    console.error('Unexpected error in POST /api/applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
