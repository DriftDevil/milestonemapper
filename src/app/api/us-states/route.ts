
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

const fipsToCode: { [key: string]: string } = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE',
  '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA',
  '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM',
  '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY',
  // Territories
  '60': 'AS', // American Samoa
  '66': 'GU', // Guam
  '69': 'MP', // Northern Mariana Islands
  '72': 'PR', // Puerto Rico
  '78': 'VI', // U.S. Virgin Islands
};

const FLAG_BASE_URL = 'https://raw.githubusercontent.com/SnpM/us-state-flags-svg/master/flags';

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
        .map((row: string[]) => {
          const fipsCode = row[1];
          const postalCode = fipsToCode[fipsCode];
          return {
              name: row[0],
              id: fipsCode, // This is the FIPS code
              flagUrl: postalCode ? `${FLAG_BASE_URL}/${postalCode}.svg` : undefined,
          };
        });
      
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
