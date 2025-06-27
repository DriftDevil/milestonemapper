
'use server';

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import type { USState } from '@/types';

const CONTEXT = "API US States and Territories";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// This mapping is retained because the backend doesn't provide flag URLs.
const fipsToFileName: { [key: string]: string } = {
    '01': 'Flag_of_Alabama.svg', '02': 'Flag_of_Alaska.svg', '04': 'Flag_of_Arizona.svg',
    '05': 'Flag_of_Arkansas.svg', '06': 'Flag_of_California.svg', '08': 'Flag_of_Colorado.svg',
    '09': 'Flag_of_Connecticut.svg', '10': 'Flag_of_Delaware.svg', '11': 'Flag_of_the_District_of_Columbia.svg',
    '12': 'Flag_of_Florida.svg', '13': 'Flag_of_Georgia_(U.S._state).svg', '15': 'Flag_of_Hawaii.svg',
    '16': 'Flag_of_Idaho.svg', '17': 'Flag_of_Illinois.svg', '18': 'Flag_of_Indiana.svg',
    '19': 'Flag_of_Iowa.svg', '20': 'Flag_of_Kansas.svg', '21': 'Flag_of_Kentucky.svg',
    '22': 'Flag_of_Louisiana.svg', '23': 'Flag_of_Maine.svg', '24': 'Flag_of_Maryland.svg',
    '25': 'Flag_of_Massachusetts.svg', '26': 'Flag_of_Michigan.svg', '27': 'Flag_of_Minnesota.svg',
    '28': 'Flag_of_Mississippi.svg', '29': 'Flag_of_Missouri.svg', '30': 'Flag_of_Montana.svg',
    '31': 'Flag_of_Nebraska.svg', '32': 'Flag_of_Nevada.svg', '33': 'Flag_of_New_Hampshire.svg',
    '34': 'Flag_of_New_Jersey.svg', '35': 'Flag_of_New_Mexico.svg', '36': 'Flag_of_New_York.svg',
    '37': 'Flag_of_North_Carolina.svg', '38': 'Flag_of_North_Dakota.svg', '39': 'Flag_of_Ohio.svg',
    '40': 'Flag_of_Oklahoma.svg', '41': 'Flag_of_Oregon.svg', '42': 'Flag_of_Pennsylvania.svg',
    '44': 'Flag_of_Rhode_Island.svg', '45': 'Flag_of_South_Carolina.svg', '46': 'Flag_of_South_Dakota.svg',
    '47': 'Flag_of_Tennessee.svg', '48': 'Flag_of_Texas.svg', '49': 'Flag_of_Utah.svg',
    '50': 'Flag_of_Vermont.svg', '51': 'Flag_of_Virginia.svg', '53': 'Flag_of_Washington.svg',
    '54': 'Flag_of_West_Virginia.svg', '55': 'Flag_of_Wisconsin.svg', '56': 'Flag_of_Wyoming.svg',
    // Territories
    '60': 'Flag_of_American_Samoa.svg',
    '66': 'Flag_of_Guam.svg',
    '69': 'Flag_of_the_Northern_Mariana_Islands.svg',
    '72': 'Flag_of_Puerto_Rico.svg',
    '78': 'Flag_of_the_U.S._Virgin_Islands.svg',
};

const FLAG_BASE_URL = 'https://raw.githubusercontent.com/SnpM/us-state-flags-svg/master/flags';

export async function GET() {
  if (!EXTERNAL_API_URL) {
    logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set. US States data cannot be fetched.');
    return NextResponse.json({ message: 'API for US States is not configured.' }, { status: 500 });
  }
  
  const statesUrl = new URL('/v1/states', EXTERNAL_API_URL).toString();

  try {
    const apiResponse = await fetch(statesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // This data changes infrequently, so we can cache it for a day.
      next: { revalidate: 86400 }
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      logger.error(CONTEXT, `Backend API error! Status: ${apiResponse.status}`, errorData);
      throw new Error(`Failed to fetch state data from backend. Status: ${apiResponse.status}`);
    }

    const data: any[] = await apiResponse.json();

    const mappedData: USState[] = data.map((state: any) => {
        const fipsCode = state.fips_code;
        const fileName = fipsToFileName[fipsCode];
        return {
            id: fipsCode, // id for TrackableItem is the FIPS code
            dbId: state.id, // dbId is the backend primary key
            name: state.name,
            abbreviation: state.abbreviation,
            is_territory: state.is_territory,
            flagUrl: fileName ? `${FLAG_BASE_URL}/${fileName}` : undefined,
        };
    });
    
    // Sort alphabetically by name
    const sortedData = mappedData.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(sortedData);

  } catch (error: any) {
    logger.error(CONTEXT, 'Error fetching data from backend states API:', error.message);
    return NextResponse.json({ message: 'An unexpected error occurred while fetching state data.' }, { status: 500 });
  }
}
