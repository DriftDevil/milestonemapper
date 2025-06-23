
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

    const responseBodyText = await apiResponse.text();
    let responseData;

    try {
        responseData = JSON.parse(responseBodyText);
    } catch (e) {
        logger.error(CONTEXT, `Failed to parse JSON response from external API. Status: ${apiResponse.status}. Body: ${responseBodyText}`);
        return NextResponse.json({ success: false, message: 'Received an invalid response from the authentication service.' }, { status: 502 });
    }

    if (!apiResponse.ok) {
        logger.error(CONTEXT, `External API login failed for ${identifier}. Status: ${apiResponse.status}`, responseData);
        // Attempt to find a meaningful error message from a nested structure
        const message = responseData.error?.message || responseData.message || 'Invalid credentials or external API error.';
        const details = responseData.error?.details || 'No details provided.';
        return NextResponse.json({ success: false, message, details }, { status: apiResponse.status });
    }

    // Standard Strapi v4 response includes a 'jwt' field. This is a common source of error.
    const token = responseData.jwt;
    if (!token) {
      logger.error(CONTEXT, `JWT token not found in external API response for identifier ${identifier}. Full response:`, JSON.stringify(responseData));
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
