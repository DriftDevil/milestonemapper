
import type { NationalPark, MLBStadium, NFLStadium } from '@/types';

// Countries will be fetched from an API in page.tsx
// US States will be fetched from an API in page.tsx

export const nationalParks: NationalPark[] = [
  { id: 'acad', name: 'Acadia National Park', state: 'Maine' },
  { id: 'arch', name: 'Arches National Park', state: 'Utah' },
  { id: 'badl', name: 'Badlands National Park', state: 'South Dakota' },
  { id: 'yell', name: 'Yellowstone National Park', state: 'Wyoming, Montana, Idaho' },
  { id: 'yose', name: 'Yosemite National Park', state: 'California' },
  { id: 'zion', name: 'Zion National Park', state: 'Utah' },
  // Add all 63 national parks
];

export const mlbBallparks: MLBStadium[] = [
  { id: 'ana', name: 'Angel Stadium', team: 'Los Angeles Angels', city: 'Anaheim', state: 'CA' },
  { id: 'hou', name: 'Minute Maid Park', team: 'Houston Astros', city: 'Houston', state: 'TX' },
  { id: 'oak', name: 'Oakland Coliseum', team: 'Oakland Athletics', city: 'Oakland', state: 'CA' },
  // Add all 30 MLB ballparks
];

export const nflStadiums: NFLStadium[] = [
  { id: 'ari', name: 'State Farm Stadium', team: 'Arizona Cardinals', city: 'Glendale', state: 'AZ' },
  { id: 'atl', name: 'Mercedes-Benz Stadium', team: 'Atlanta Falcons', city: 'Atlanta', state: 'GA' },
  { id: 'bal', name: 'M&T Bank Stadium', team: 'Baltimore Ravens', city: 'Baltimore', state: 'MD' },
  // Add all ~30-32 NFL stadiums
];
