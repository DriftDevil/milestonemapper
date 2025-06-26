
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { USState } from '@/types';

const CONTEXT = "API US States and Territories";

const CENSUS_API_URLS = [
    "https://api.census.gov/data/2023/geoinfo?get=NAME&for=state:*",        // 50 states + DC + PR
    "https://api.census.gov/data/2020/dec/dpgu?get=NAME&for=state:*",         // Guam
    "https://api.census.gov/data/2020/dec/dpvi?get=NAME&for=state:*",         // U.S. Virgin Islands
    "https://api.census.gov/data/2020/dec/dpas?get=NAME&for=state:*",         // American Samoa
    "https://api.census.gov/data/2020/dec/dpmp?get=NAME&for=state:*",         // Northern Mariana Islands
];
const API_KEY = process.env.CENSUS_API_KEY;

export async function GET() {
  if (!API_KEY) {
    logger.error(CONTEXT, 'CENSUS_API_KEY is not set. US States data cannot be fetched.');
    return NextResponse.json({ message: 'API for US States is not configured.' }, { status: 500 });
  }

  const fetchPromises = CENSUS_API_URLS.map(baseUrl => {
    const fetchUrl = `${baseUrl}&key=${API_KEY}`;
    return fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for a week, as this data rarely changes.
      next: { revalidate: 604800 }
    });
  });

  try {
    const responses = await Promise.all(fetchPromises);
    let allStatesAndTerritories: USState[] = [];

    for (const apiResponse of responses) {
      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        const url = apiResponse.url.split('&key=')[0]; // Don't log API key
        logger.error(CONTEXT, `Census API error! Status: ${apiResponse.status} from ${url}`, errorData);
        // Fail the entire request if one source fails
        throw new Error(`Failed to fetch state data from one or more external sources. Status: ${apiResponse.status}`);
      }

      const data: string[][] = await apiResponse.json();

      // The first row is the header, e.g., ["NAME", "state"]. We skip it.
      const mappedData: USState[] = data
        .slice(1)
        .map((row: string[]) => ({
          name: row[0],
          id: row[1], // This is the FIPS code
        }));
      
      allStatesAndTerritories = [...allStatesAndTerritories, ...mappedData];
    }
    
    // Sort alphabetically by name
    const sortedData = allStatesAndTerritories.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(sortedData);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching data from Census API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching state data.' }, { status: 500 });
  }
}
