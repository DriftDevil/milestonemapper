
"use client";

import { useState, useEffect } from 'react';
import type { CategorySlug, Country as CountryType, USState as USStateType, NationalPark as NationalParkType, TrackableItem } from '@/types';
import { CategoryCard } from "@/components/CategoryCard";
import { GlobeIcon, UsaFlagIcon, MountainIcon, BaseballIcon, FootballIcon, MilestoneMapperIcon } from "@/components/icons";
import { CountryTracker } from "@/components/trackers/CountryTracker";
import { StateTracker } from "@/components/trackers/StateTracker";
import { NationalParkTracker } from "@/components/trackers/NationalParkTracker";
import { MlbStadiumTracker } from "@/components/trackers/MlbStadiumTracker";
import { NflStadiumTracker } from "@/components/trackers/NflStadiumTracker";
import * as localData from "@/lib/data";
import { useTravelData } from "@/hooks/useTravelData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

interface CategoryConfig {
  slug: CategorySlug;
  title: string;
  icon: React.ElementType;
  totalCount: number;
  data: TrackableItem[];
  TrackerComponent: React.ElementType;
  cardColor: string;
  error?: string;
}

const initialCategories: CategoryConfig[] = [
  {
    slug: 'countries',
    title: "Countries",
    icon: GlobeIcon,
    totalCount: 0,
    data: [] as CountryType[],
    TrackerComponent: CountryTracker,
    cardColor: "text-blue-500",
  },
  {
    slug: 'us-states',
    title: "U.S. States",
    icon: UsaFlagIcon,
    totalCount: 0,
    data: [] as USStateType[],
    TrackerComponent: StateTracker,
    cardColor: "text-red-500",
  },
  {
    slug: 'national-parks',
    title: "National Parks",
    icon: MountainIcon,
    totalCount: 0,
    data: [] as NationalParkType[],
    TrackerComponent: NationalParkTracker,
    cardColor: "text-green-600",
  },
  {
    slug: 'mlb-ballparks',
    title: "MLB Ballparks",
    icon: BaseballIcon,
    totalCount: localData.mlbBallparks.length,
    data: localData.mlbBallparks,
    TrackerComponent: MlbStadiumTracker,
    cardColor: "text-orange-500",
  },
  {
    slug: 'nfl-stadiums',
    title: "NFL Stadiums",
    icon: FootballIcon,
    totalCount: localData.nflStadiums.length,
    data: localData.nflStadiums,
    TrackerComponent: NflStadiumTracker,
    cardColor: "text-purple-500",
  },
];

export default function HomePage() {
  const {
    getVisitedCount,
    isLoaded: travelDataLoaded,
    toggleItemVisited,
    isItemVisited,
    setNationalParkVisitDate,
    getNationalParkVisitDate,
    clearCategoryVisited,
  } = useTravelData();
  const [categories, setCategories] = useState<CategoryConfig[]>(initialCategories);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [nationalParksLoading, setNationalParksLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,ccn3');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawCountries: Array<{ name: { common: string }, cca2: string, ccn3?: string }> = await response.json();
        const formattedCountries: CountryType[] = rawCountries
          .map(country => ({
            id: country.cca2.toUpperCase(),
            name: country.name.common,
            code: country.cca2.toUpperCase(),
            numericCode: country.ccn3,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'countries'
              ? { ...cat, data: formattedCountries, totalCount: formattedCountries.length, error: undefined }
              : cat
          )
        );
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'countries'
              ? { ...cat, data: [], totalCount: 0, error: "Failed to load countries. Please try again later." }
              : cat
          )
        );
      } finally {
        setCountriesLoading(false);
      }
    }

    async function fetchStates() {
      const apiKey = process.env.NEXT_PUBLIC_CENSUS_API_KEY;
      if (!apiKey) {
        console.warn("Census API key is missing. U.S. States data will not be loaded.");
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'us-states'
              ? { ...cat, data: [], totalCount: 0, error: "API key missing. Cannot load U.S. States." }
              : cat
          )
        );
        setStatesLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://api.census.gov/data/2023/geoinfo?get=NAME&for=state:*&key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawStatesData: string[][] = await response.json();
        const formattedStates: USStateType[] = rawStatesData
          .slice(1)
          .map(stateArray => ({
            id: stateArray[1], // FIPS code for state
            name: stateArray[0],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'us-states'
              ? { ...cat, data: formattedStates, totalCount: formattedStates.length, error: undefined }
              : cat
          )
        );
      } catch (error) {
        console.error("Failed to fetch U.S. states:", error);
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'us-states'
              ? { ...cat, data: [], totalCount: 0, error: "Failed to load U.S. States. Please try again later." }
              : cat
          )
        );
      } finally {
        setStatesLoading(false);
      }
    }

    async function fetchNationalParks() {
      const apiKey = process.env.NEXT_PUBLIC_NPS_API_KEY;
      if (!apiKey) {
        console.warn("NPS API key is missing. National Parks data will not be loaded.");
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'national-parks'
              ? { ...cat, data: [], totalCount: 0, error: "API key missing. Cannot load National Parks." }
              : cat
          )
        );
        setNationalParksLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?limit=100&designationCode=NATP&fields=states&api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const npsData: { data: Array<{ parkCode: string, fullName: string, states: string }> } = await response.json();
        const formattedParks: NationalParkType[] = npsData.data
          .map(park => ({
            id: park.parkCode,
            name: park.fullName,
            state: park.states,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'national-parks'
              ? { ...cat, data: formattedParks, totalCount: formattedParks.length, error: undefined }
              : cat
          )
        );
      } catch (error) {
        console.error("Failed to fetch National Parks:", error);
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.slug === 'national-parks'
              ? { ...cat, data: [], totalCount: 0, error: "Failed to load National Parks. Please try again later." }
              : cat
          )
        );
      } finally {
        setNationalParksLoading(false);
      }
    }

    fetchCountries();
    fetchStates();
    fetchNationalParks();
  }, []);

  const overallLoading = !travelDataLoaded || countriesLoading || statesLoading || nationalParksLoading;

  if (overallLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <MilestoneMapperIcon className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-headline text-primary">Milestone Mapper</h1>
          </div>
          <p className="text-xl text-muted-foreground font-body">
            Visually track your travel achievements and explore new horizons.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(5).fill(0).map((_, index) => (
            <Card className="flex flex-col shadow-lg" key={index}>
              <CardHeader className="pb-3">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-1/4 ml-auto" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
           <div className="inline-flex items-center gap-3 mb-4">
            <MilestoneMapperIcon className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-headline text-primary">Milestone Mapper</h1>
          </div>
          <p className="text-xl text-muted-foreground font-body">
            Visually track your travel achievements and explore new horizons.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const trackerSpecificProps: any = {
              isItemVisited: isItemVisited,
              toggleItemVisited: toggleItemVisited,
              categorySlug: category.slug,
              clearCategoryVisited: clearCategoryVisited,
            };
            if (category.slug === 'countries') trackerSpecificProps.countries = category.data;
            else if (category.slug === 'us-states') trackerSpecificProps.states = category.data;
            else if (category.slug === 'national-parks') {
              trackerSpecificProps.parks = category.data;
              trackerSpecificProps.setNationalParkVisitDate = setNationalParkVisitDate;
              trackerSpecificProps.getNationalParkVisitDate = getNationalParkVisitDate;
            }
            else if (category.slug === 'mlb-ballparks') trackerSpecificProps.stadiums = category.data;
            else if (category.slug === 'nfl-stadiums') trackerSpecificProps.stadiums = category.data;

            return (
              <CategoryCard
                key={category.slug}
                title={category.title}
                icon={category.icon}
                visitedCount={getVisitedCount(category.slug)}
                totalCount={category.totalCount}
                cardColor={category.cardColor}
              >
                {category.error ? (
                  <p className="text-destructive text-center p-4">{category.error}</p>
                ) : (
                  <category.TrackerComponent {...trackerSpecificProps} />
                )}
              </CategoryCard>
            );
          })}
        </div>
      </div>
       <footer className="py-8 text-center text-muted-foreground">
         <div className="mb-4">
          <ThemeToggle />
        </div>
        <p>&copy; {new Date().getFullYear()} Milestone Mapper. Happy travels!</p>
      </footer>
    </main>
  );
}

