
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { Country } from '@/types';

const CONTEXT = "API All Countries";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// This route handler now fetches a master list of all countries from our own backend.
export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'Critical: EXTERNAL_API_BASE_URL is not set.');
    return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
  }

  const countriesUrl = new URL('/v1/countries', EXTERNAL_API_URL).toString();

  try {
    // This is a public endpoint, so no auth token is needed.
    const apiResponse = await fetch(countriesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Re-fetch data on every request to ensure freshness from the backend
      cache: 'no-store',
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Backend API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch country data from backend.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // Map the response from our backend to our application's frontend Country type.
    // The key is that the frontend application uses the 'cca2' code as the 'id'.
    const mappedCountries: Country[] = data.map((country: any) => ({
      id: country.code, // Use cca2 as the unique ID for the frontend
      name: country.name,
      code: country.code,
      numericCode: country.ccn3, // Required for the world map component
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      flagUrl: country.flagUrl, // New field from our backend
    }));

    return NextResponse.json(mappedCountries);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching countries from backend API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching country data.' }, { status: 500 });
  }
}
