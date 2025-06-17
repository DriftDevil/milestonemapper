
export type CategorySlug = 'countries' | 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums';

export interface TrackableItem {
  id: string;
  name: string;
}

export interface Country extends TrackableItem {
  code: string; // ISO 3166-1 alpha-2 code (cca2 from API)
  // name will be common name from API
}

export interface USState extends TrackableItem {
  code: string; // 2-letter postal abbreviation
}

export interface NationalPark extends TrackableItem {
  state: string; // State(s) where the park is located
  region?: string; // Optional region
}

export interface MLBStadium extends TrackableItem {
  team: string;
  city: string;
  state: string;
}

export interface NFLStadium extends TrackableItem {
  team: string;
  city: string;
  state: string;
  // Add support for historical if needed, e.g., previousName, yearsActive
}

export interface Category {
  slug: CategorySlug;
  title: string;
  Icon: React.ElementType;
  totalItems: number;
  data: TrackableItem[];
}

export interface VisitedItems {
  countries: Set<string>;
  'us-states': Set<string>;
  'national-parks': Set<string>;
  'mlb-ballparks': Set<string>;
  'nfl-stadiums': Set<string>;
}
