
'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const CONTEXT = "API Password Login";

// This is now a mock login handler. It doesn't connect to a real database.
// It will accept any non-empty username and password to allow for easy testing
// of the authenticated state of the application.

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      logger.warn(CONTEXT, 'Login attempt with missing identifier or password.');
      return NextResponse.json({ success: false, message: 'Email/Username and password are required.' }, { status: 400 });
    }

    // In a real application, you would validate the credentials against a database.
    // For this prototype, we'll consider any non-empty credentials as valid.
    logger.info(CONTEXT, `Mock login successful for identifier: ${identifier}.`);

    // The "token" is just a placeholder value. The presence of the cookie is what matters.
    const token = 'mock_session_token_for_milestone_mapper';

    const response = NextResponse.json({ success: true, message: "Login successful" });

    response.cookies.set('session_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    logger.info(CONTEXT, `Session cookie set for ${identifier}.`);
    return response;

  } catch (error: any) {
    logger.error(CONTEXT, 'Internal error in mock login handler:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
