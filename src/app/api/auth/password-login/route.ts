
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

    const loginUrl = new URL('/auth/local/login', EXTERNAL_API_URL).toString();
    logger.info(CONTEXT, `Attempting login for identifier: ${identifier} to ${loginUrl}`);

    const apiResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
        const errorMessage = responseData.message || 'Invalid credentials or external API error.';
        logger.error(CONTEXT, `External API login failed for ${identifier}. Status: ${apiResponse.status}`, { error: errorMessage, details: responseData.details });
        return NextResponse.json({ success: false, message: errorMessage }, { status: apiResponse.status });
    }

    const token = responseData.accessToken || responseData.token || responseData.jwt;
    
    if (!token) {
      logger.error(CONTEXT, `Token ('accessToken', 'token', or 'jwt') not found in external API response for identifier ${identifier}. Full response:`, JSON.stringify(responseData));
      return NextResponse.json({ success: false, message: 'Authentication service did not provide a valid token.' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, message: "Login successful" });

    response.cookies.set('session_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true,
        sameSite: 'none',
    });

    logger.info(CONTEXT, `Session cookie set for ${identifier}.`);
    return response;

  } catch (error: any) {
    logger.error(CONTEXT, 'Internal error in password login handler:', error.message, error.stack);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ success: false, message: 'Received an invalid response from the authentication service.' }, { status: 502 });
    }
    return NextResponse.json({ success: false, message: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
