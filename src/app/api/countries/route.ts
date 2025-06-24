
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { Country } from '@/types';

const CONTEXT = "API All Countries";

// This route handler now fetches a master list of all countries from a public API.
// It is used by the dashboard to populate the country tracker and map.
export async function GET() {
  try {
    const apiResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,ccn3,region,subregion,population', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for a day
      next: { revalidate: 86400 }
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `RestCountries API error! Status: ${apiResponse.status}`, errorData);
      return NextResponse.json({ message: 'Failed to fetch country data from external source.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // Map the response to our application's Country type
    const mappedCountries: Country[] = data.map((country: any) => ({
      id: country.cca2, // Use cca2 as the unique ID
      name: country.name.common,
      code: country.cca2,
      numericCode: country.ccn3,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
    }));

    return NextResponse.json(mappedCountries);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching countries from RestCountries API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching country data.' }, { status: 500 });
  }
}
