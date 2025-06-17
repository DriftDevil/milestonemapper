
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
  { id: "ARI", name: "Chase Field", team: "Arizona Diamondbacks", city: "Phoenix", state: "AZ" },
  { id: "ATL", name: "Truist Park", team: "Atlanta Braves", city: "Cumberland", state: "GA" },
  { id: "BAL", name: "Oriole Park at Camden Yards", team: "Baltimore Orioles", city: "Baltimore", state: "MD" },
  { id: "BOS", name: "Fenway Park", team: "Boston Red Sox", city: "Boston", state: "MA" },
  { id: "CHC", name: "Wrigley Field", team: "Chicago Cubs", city: "Chicago", state: "IL" },
  { id: "CHW", name: "Guaranteed Rate Field", team: "Chicago White Sox", city: "Chicago", state: "IL" },
  { id: "CIN", name: "Great American Ball Park", team: "Cincinnati Reds", city: "Cincinnati", state: "OH" },
  { id: "CLE", name: "Progressive Field", team: "Cleveland Guardians", city: "Cleveland", state: "OH" },
  { id: "COL", name: "Coors Field", team: "Colorado Rockies", city: "Denver", state: "CO" },
  { id: "DET", name: "Comerica Park", team: "Detroit Tigers", city: "Detroit", state: "MI" },
  { id: "HOU", name: "Minute Maid Park", team: "Houston Astros", city: "Houston", state: "TX" },
  { id: "KCR", name: "Kauffman Stadium", team: "Kansas City Royals", city: "Kansas City", state: "MO" },
  { id: "LAA", name: "Angel Stadium", team: "Los Angeles Angels", city: "Anaheim", state: "CA" },
  { id: "LAD", name: "Dodger Stadium", team: "Los Angeles Dodgers", city: "Los Angeles", state: "CA" },
  { id: "MIA", name: "LoanDepot Park", team: "Miami Marlins", city: "Miami", state: "FL" },
  { id: "MIL", name: "American Family Field", team: "Milwaukee Brewers", city: "Milwaukee", state: "WI" },
  { id: "MIN", name: "Target Field", team: "Minnesota Twins", city: "Minneapolis", state: "MN" },
  { id: "NYM", name: "Citi Field", team: "New York Mets", city: "Queens", state: "NY" },
  { id: "NYY", name: "Yankee Stadium", team: "New York Yankees", city: "Bronx", state: "NY" },
  { id: "OAK", name: "Oakland Coliseum", team: "Oakland Athletics", city: "Oakland", state: "CA" },
  { id: "PHI", name: "Citizens Bank Park", team: "Philadelphia Phillies", city: "Philadelphia", state: "PA" },
  { id: "PIT", name: "PNC Park", team: "Pittsburgh Pirates", city: "Pittsburgh", state: "PA" },
  { id: "SDP", name: "Petco Park", team: "San Diego Padres", city: "San Diego", state: "CA" },
  { id: "SEA", name: "T-Mobile Park", team: "Seattle Mariners", city: "Seattle", state: "WA" },
  { id: "SFG", name: "Oracle Park", team: "San Francisco Giants", city: "San Francisco", state: "CA" },
  { id: "STL", name: "Busch Stadium", team: "St. Louis Cardinals", city: "St. Louis", state: "MO" },
  { id: "TBR", name: "Tropicana Field", team: "Tampa Bay Rays", city: "St. Petersburg", state: "FL" },
  { id: "TEX", name: "Globe Life Field", team: "Texas Rangers", city: "Arlington", state: "TX" },
  { id: "TOR", name: "Rogers Centre", team: "Toronto Blue Jays", city: "Toronto", state: "ON" },
  { id: "WSN", name: "Nationals Park", team: "Washington Nationals", city: "Washington", state: "DC" }
];

export const nflStadiums: NFLStadium[] = [
  { id: 'ari', name: 'State Farm Stadium', team: 'Arizona Cardinals', city: 'Glendale', state: 'AZ' },
  { id: 'atl', name: 'Mercedes-Benz Stadium', team: 'Atlanta Falcons', city: 'Atlanta', state: 'GA' },
  { id: 'bal', name: 'M&T Bank Stadium', team: 'Baltimore Ravens', city: 'Baltimore', state: 'MD' },
  // Add all ~30-32 NFL stadiums
];

