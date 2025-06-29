
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { NFLStadium } from '@/types';

const CONTEXT = "API NFL Stadiums";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'Critical: EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  // The user mentioned /v1/stadiums
  const stadiumsUrl = new URL('/v1/stadiums', EXTERNAL_API_URL).toString();

  try {
    const apiResponse = await fetch(stadiumsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Data could have coordinates added later
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Backend API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch stadium data from backend.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    const mappedStadiums: NFLStadium[] = data.map((stadium: any) => ({
      id: String(stadium.id),
      name: stadium.name,
      team: stadium.team,
      city: stadium.city,
      state: stadium.state,
      latitude: stadium.lat ? parseFloat(stadium.lat) : undefined,
      longitude: stadium.lon ? parseFloat(stadium.lon) : undefined,
    }));

    // Sort alphabetically by stadium name, then team name
    const sortedStadiums = mappedStadiums.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return a.team.localeCompare(b.team);
    });


    return NextResponse.json(sortedStadiums);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching stadiums from backend API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching stadium data.' }, { status: 500 });
  }
}
