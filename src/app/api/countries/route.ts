
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

const CONTEXT = "API Countries";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  try {
    const apiResponse = await fetch(`${EXTERNAL_API_URL}/countries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for an hour
      next: { revalidate: 3600 }
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(data, { status: apiResponse.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching countries:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
