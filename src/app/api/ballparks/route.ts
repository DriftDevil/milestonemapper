
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { MLBStadium } from '@/types';

const CONTEXT = "API MLB Ballparks";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'Critical: EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  const ballparksUrl = new URL('/v1/ballparks', EXTERNAL_API_URL).toString();

  try {
    const apiResponse = await fetch(ballparksUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 }, // Cache for a day
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Backend API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch ballpark data from backend.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // Map the response to our frontend type, converting numeric id to string.
    const mappedBallparks: MLBStadium[] = data.map((ballpark: any) => ({
      id: String(ballpark.id), // Convert numeric ID to string for frontend consistency
      name: ballpark.name,
      team: ballpark.team,
      city: ballpark.city,
      state: ballpark.state,
    }));

    // Sort alphabetically by stadium name
    const sortedBallparks = mappedBallparks.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(sortedBallparks);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching ballparks from backend API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching ballpark data.' }, { status: 500 });
  }
}
