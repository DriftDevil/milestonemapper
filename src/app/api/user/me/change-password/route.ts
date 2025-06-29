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
    const body = await request.json();

    if (!body.currentPassword || !body.newPassword) {
      logger.warn(CONTEXT, 'Change password request missing required fields.', { body });
      return NextResponse.json({ message: 'Both current and new passwords are required.' }, { status: 400 });
    }

    const changePasswordUrl = new URL('/auth/local/me/change-password', EXTERNAL_API_URL).toString();

    const apiResponse = await fetch(changePasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
        let errorMessage = 'Failed to change password.';
        try {
            const errorJson = JSON.parse(responseText);
            errorMessage = errorJson.message || errorMessage;
        } catch (e) {
            if(responseText) errorMessage = responseText;
        }
        logger.error(CONTEXT, `Failed to change password. Status: ${apiResponse.status}`, { error: errorMessage });
        return NextResponse.json({ success: false, message: errorMessage }, { status: apiResponse.status });
    }
    
    return NextResponse.json({ success: true, message: 'Password changed successfully.' }, { status: 200 });

  } catch (error: any) {
    logger.error(CONTEXT, 'Error in change password handler:', error.message);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
