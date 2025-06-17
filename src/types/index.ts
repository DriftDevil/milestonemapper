
export type CategorySlug = 'countries' | 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums';

export interface TrackableItem {
  id: string; // For US States, this will be the FIPS code. For National Parks, parkCode.
  name: string;
}

export interface Country extends TrackableItem {
  code: string; // ISO 3166-1 alpha-2 code (cca2 from API)
}

export interface USState extends TrackableItem {
  // 'id' will be the FIPS code (e.g., "01")
  // 'name' will be the state name (e.g., "Alabama")
}

export interface NationalPark extends TrackableItem {
  state: string; // State(s) where the park is located (e.g. "CA,NV" or "WY")
  region?: string; // Optional region - not currently used from API
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

