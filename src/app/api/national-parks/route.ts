
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { NationalPark } from '@/types';

const CONTEXT = "API National Parks";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// This route handler fetches a list of parks from the backend API
// and filters them to only include "National Parks".
export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'Critical: EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  const parksUrl = new URL('/v1/parks', EXTERNAL_API_URL).toString();

  try {
    // This is a public endpoint, no auth token needed.
    const apiResponse = await fetch(parksUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // This data changes infrequently, so we can cache it for a day.
      next: { revalidate: 86400 }, 
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Backend API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch park data from backend.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // Filter for parks with the designation "National Park"
    const nationalParksData = data.filter((park: any) => park.designation === "National Park");

    // Map the response from the backend to our application's frontend NationalPark type.
    const mappedParks: NationalPark[] = nationalParksData
      .map((park: any) => {
        const lat = parseFloat(park.latitude);
        const lon = parseFloat(park.longitude);

        return {
          id: park.park_code,
          name: park.full_name,
          state: park.states,
          latitude: isNaN(lat) ? undefined : lat,
          longitude: isNaN(lon) ? undefined : lon,
        };
      })
      // Filter out any parks that don't have a valid name to prevent crashes.
      .filter((park: { name: string | any[]; }) => typeof park.name === 'string' && park.name.length > 0);

    // Sort alphabetically by name
    const sortedParks = mappedParks.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(sortedParks);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching parks from backend API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching park data.' }, { status: 500 });
  }
}
