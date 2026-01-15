/**
 * JAT v2 - Application Detail API Route
 * PATCH /api/applications/[id] - Update application
 * DELETE /api/applications/[id] - Delete application
 * 
 * SECURITY:
 * - User identity derived from server-side Supabase auth
 * - RLS policies enforce data ownership at database level
 * - User cannot access or modify other users' applications
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateApplication, deleteApplication } from '@/lib/db/applications';
import { updateApplicationSchema } from '@/lib/validations/application';
import { ZodError } from 'zod';

/**
 * PATCH /api/applications/[id]
 * Updates an existing application for the authenticated user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get application ID from route params
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Parse raw request body
    const rawBody = await request.json();

    // Ensure at least one field is being updated (before Zod transforms)
    if (Object.keys(rawBody).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validatedData = updateApplicationSchema.parse(rawBody);

    // Update application via data access layer
    const result = await updateApplication(id, {
      ...(validatedData.company_name !== undefined && { company_name: validatedData.company_name }),
      ...(validatedData.position_title !== undefined && { position_title: validatedData.position_title }),
      ...(validatedData.application_date !== undefined && { application_date: validatedData.application_date }),
      ...(validatedData.status !== undefined && { status: validatedData.status }),
      ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
    });

    if (!result.success) {
      // Check if it's an authorization issue (application not found or not owned by user)
      if (result.error.includes('not found') || result.error.includes('access denied')) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: result.data },
      { status: 200 }
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
    console.error('Unexpected error in PATCH /api/applications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/applications/[id]
 * Deletes an application for the authenticated user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get application ID from route params
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Delete application via data access layer
    const result = await deleteApplication(id);

    if (!result.success) {
      // Check if it's an authorization issue (application not found or not owned by user)
      if (result.error.includes('not found') || result.error.includes('access denied')) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Application deleted successfully',
        data: result.data 
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in DELETE /api/applications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
