
'use server';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const CONTEXT = "API Password Login";

const MODULE_EXTERNAL_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!MODULE_EXTERNAL_API_BASE_URL) {
  logger.error(CONTEXT, 'CRITICAL: NEXT_PUBLIC_API_URL environment variable is not set AT MODULE LOAD. Password login WILL FAIL.');
} else {
  logger.info(CONTEXT, `NEXT_PUBLIC_API_URL is configured at module load: ${MODULE_EXTERNAL_API_BASE_URL}`);
}

export async function POST(request: NextRequest) {
  const currentExternalApiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!currentExternalApiBaseUrl) {
    logger.error(CONTEXT, 'Critical: NEXT_PUBLIC_API_URL is not set at request time. Password login cannot function.');
    return NextResponse.json({ success: false, message: 'API endpoint not configured.', details: 'Server configuration error: NEXT_PUBLIC_API_URL not set.' }, { status: 500 });
  }

  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ success: false, message: 'Email/Username and password are required.', details: 'Missing credentials in request.' }, { status: 400 });
    }

    logger.info(CONTEXT, `Attempting password login for identifier: ${identifier} to external API: ${currentExternalApiBaseUrl}/auth/local/login (Password NOT logged)`);

    const apiResponse = await fetch(`${currentExternalApiBaseUrl}/auth/local/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const responseBodyText = await apiResponse.text();

    if (!apiResponse.ok) {
      let errorDetails: string;
      try {
        const parsedError = JSON.parse(responseBodyText);
        errorDetails = parsedError.message || parsedError.error || responseBodyText;
      } catch (e) {
        errorDetails = `External API returned status ${apiResponse.status} with non-JSON body: ${responseBodyText.substring(0, 200)}...`;
      }
      logger.error(CONTEXT, `External API login failed for identifier ${identifier}: ${apiResponse.status}`, errorDetails);
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.', details: errorDetails },
        { status: apiResponse.status }
      );
    }
    
    let responseData;
    try {
        responseData = JSON.parse(responseBodyText);
    } catch (e: any) {
        logger.error(CONTEXT, `Error parsing successful external API response for identifier ${identifier} as JSON:`, e.message, `Body: ${responseBodyText.substring(0,500)}...`);
        return NextResponse.json(
            { success: false, message: 'Failed to parse response from authentication service.', details: 'The authentication service responded successfully but its data could not be processed.' },
            { status: 502 }
        );
    }

    const token = responseData.accessToken;
    if (!token) {
      logger.error(CONTEXT, `accessToken not found in external API response for identifier ${identifier}. Received:`, responseData);
      return NextResponse.json({ success: false, message: 'Authentication service did not provide an accessToken.', details: 'Check server logs for the full response from the authentication service.' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, message: "Login successful" });
    response.cookies.set('session_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    logger.info(CONTEXT, `Successfully processed login for ${identifier}. Returning JSON success response with Set-Cookie header.`);
    return response;

  } catch (error: any) {
    logger.error(CONTEXT, 'Internal error in POST handler:', error.message, error.stack);
    let errorMessage = 'An unexpected error occurred during password login.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, message: 'Internal server error during login process.', details: errorMessage }, { status: 500 });
  }
}
