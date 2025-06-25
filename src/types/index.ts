
export type CategorySlug = 'countries' | 'us-states' | 'national-parks' | 'mlb-ballparks' | 'nfl-stadiums';

export interface TrackableItem {
  id: string; // For Countries this is the UUID, for US States FIPS code, for others a custom ID.
  name: string;
}

export interface Country extends TrackableItem {
  code: string; // ISO 3166-1 alpha-2 code
  region?: string;
  subregion?: string;
  population?: number;
  flagUrl?: string;
}

export interface UserCountry {
  id: string; // This is the ID of the user-country relationship record
  userId: string;
  countryId: string; // This is the UUID of the country in your backend's country table
  visitedAt: string | null;
  notes: string | null;
  createdAt: string;
  country: Country; // The nested country object
}

export interface USState extends TrackableItem {
  // 'id' will be the FIPS code (e.g., "01")
  // 'name' will be the state name (e.g., "Alabama")
}

export interface NationalPark extends TrackableItem {
  state: string; // State(s) where the park is located (e.g. "CA,NV" or "WY")
  region?: string; // Optional region - not currently used from API
}

export interface UserNationalPark {
  id: string; // This is the ID of the user-park relationship record
  userId: string;
  parkCode: string; // This matches the NationalPark 'id'
  visitedAt: string | null;
  createdAt: string;
  park: NationalPark; // The nested park object
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
  countries: Set<string>; // Stores country codes ('US', 'CA')
  'countries-dates': Map<string, string>; // Stores visit dates by country UUID
  'countries-notes': Map<string, string>; // Stores notes by country UUID
  'us-states': Set<string>;
  'national-parks': Set<string>;
  'national-parks-dates': Map<string, string>; // parkId -> date string (YYYY-MM-DD)
  'mlb-ballparks': Set<string>;
  'nfl-stadiums': Set<string>;
}
