'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

const CONTEXT = "API User Change Password";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

export async function POST(request: NextRequest) {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      logger.warn(CONTEXT, 'Change password attempt with missing fields.');
      return NextResponse.json({ success: false, message: 'Current password and new password are required fields.' }, { status: 400 });
    }
    
    const changePasswordUrl = new URL('/auth/local/me/change-password', EXTERNAL_API_URL).toString();

    const apiResponse = await fetch(changePasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // The backend Go code expects "oldPassword", not "currentPassword". This is the fix.
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
    });

    // Check if the response has a body before trying to parse it
    if (apiResponse.status === 204 || apiResponse.headers.get('content-length') === '0') {
      return NextResponse.json({ success: true, message: 'Password changed successfully.' }, { status: 200 });
    }

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
        const errorMessage = responseData.message || 'Failed to change password at the backend.';
        logger.error(CONTEXT, `Backend error changing password. Status: ${apiResponse.status}`, { error: errorMessage, details: responseData });
        return NextResponse.json({ success: false, message: errorMessage }, { status: apiResponse.status });
    }
    
    return NextResponse.json({ success: true, message: 'Password changed successfully.' }, { status: 200 });

  } catch (error: any) {
    logger.error(CONTEXT, 'Error in change password handler:', { message: error.message, stack: error.stack });
    if (error.name === 'SyntaxError') {
       return NextResponse.json({ success: false, message: 'Invalid request from client. Please ensure all fields are filled.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
