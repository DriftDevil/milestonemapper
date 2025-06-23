
'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const CONTEXT = "API Password Login";

const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

export async function POST(request: NextRequest) {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'Critical: EXTERNAL_API_BASE_URL is not set. Password login cannot function.');
    return NextResponse.json({ success: false, message: 'API endpoint not configured.' }, { status: 500 });
  }

  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      logger.warn(CONTEXT, 'Login attempt with missing identifier or password.');
      return NextResponse.json({ success: false, message: 'Email/Username and password are required.' }, { status: 400 });
    }

    logger.info(CONTEXT, `Attempting login for identifier: ${identifier} to ${EXTERNAL_API_URL}/auth/local/login`);

    const apiResponse = await fetch(`${EXTERNAL_API_URL}/auth/local/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
        logger.error(CONTEXT, `External API login failed for ${identifier}. Status: ${apiResponse.status}`, responseData);
        const message = responseData.message || 'Invalid credentials or external API error.';
        return NextResponse.json({ success: false, message }, { status: apiResponse.status });
    }

    const token = responseData.accessToken;
    if (!token) {
      logger.error(CONTEXT, `accessToken not found in external API response for identifier ${identifier}.`, responseData);
      return NextResponse.json({ success: false, message: 'Authentication service did not provide a valid token.' }, { status: 500 });
    }

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
    logger.error(CONTEXT, 'Internal error in password login handler:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
