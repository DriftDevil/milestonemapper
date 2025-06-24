
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { USState } from '@/types';

const CONTEXT = "API US States";
const CENSUS_API_URL = "https://api.census.gov/data/2023/geoinfo?get=NAME&for=state:*";
const API_KEY = process.env.CENSUS_API_KEY;

export async function GET() {
  if (!API_KEY) {
    logger.error(CONTEXT, 'CENSUS_API_KEY is not set. US States data cannot be fetched.');
    return NextResponse.json({ message: 'API for US States is not configured.' }, { status: 500 });
  }

  const fetchUrl = `${CENSUS_API_URL}&key=${API_KEY}`;

  try {
    const apiResponse = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for a week, as this data rarely changes.
      next: { revalidate: 604800 }
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Census API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch state data from external source.' }, { status: apiResponse.status });
    }

    const data: string[][] = await apiResponse.json();

    // The first row is the header, e.g., ["NAME", "state"]. We skip it.
    const mappedStates: USState[] = data
      .slice(1)
      .map((stateRow: string[]) => ({
        name: stateRow[0],
        id: stateRow[1], // This is the FIPS code
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    return NextResponse.json(mappedStates);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching data from Census API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching state data.' }, { status: 500 });
  }
}
