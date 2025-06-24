
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
import { AuthButton } from '@/components/AuthButton';

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

export function Dashboard() {
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
          const backendRes = await fetch('/api/countries');

          if (!backendRes.ok) {
            throw new Error(`Backend API error! status: ${backendRes.status}`);
          }
          
          const backendCountries: CountryType[] = await backendRes.json();

          // Handle case where backend countries table is not seeded
          if (!backendCountries || backendCountries.length === 0) {
            console.warn("Backend returned no countries. The 'countries' feature requires data seeding.");
            setCategories(prevCategories =>
              prevCategories.map(cat =>
                cat.slug === 'countries'
                  ? { ...cat, data: [], totalCount: 0, error: "Country data is not available from the backend. Please seed the database." }
                  : cat
              )
            );
            return;
          }

          // If we have countries, proceed to get geo data to enrich them
          const geoRes = await fetch('https://restcountries.com/v3.1/all?fields=cca2,ccn3');
          if (!geoRes.ok) {
             throw new Error(`RestCountries API error! status: ${geoRes.status}`);
          }
          const geoCountries: Array<{ cca2: string, ccn3: string }> = await geoRes.json();

          // Create a map for quick lookup of numeric codes
          const geoMap = new Map(geoCountries.map(c => [c.cca2, c.ccn3]));

          // Merge backend data with geographic data
          const mergedCountries: CountryType[] = backendCountries
            .map(country => ({
              ...country,
              numericCode: geoMap.get(country.code),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
            
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'countries'
                ? { ...cat, data: mergedCountries, totalCount: mergedCountries.length, error: undefined }
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
        setCategories(prev => prev.map(c => c.slug === 'us-states' ? {...c, error: 'State data is currently unavailable.'} : c));
        setStatesLoading(false);
      }

      async function fetchNationalParks() {
         setCategories(prev => prev.map(c => c.slug === 'national-parks' ? {...c, error: 'National Park data is currently unavailable.'} : c));
        setNationalParksLoading(false);
      }

      fetchCountries();
      fetchStates();
      fetchNationalParks();
  }, []);

  const overallLoading = !travelDataLoaded || countriesLoading || statesLoading || nationalParksLoading;

  if (overallLoading) {
    return (
      <main className="flex-grow">
        {/* Skeleton for Hero Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center animate-pulse">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="h-12 md:h-16 w-72 md:w-96" />
            </div>
            <Skeleton className="h-7 w-full max-w-3xl mx-auto mt-4" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto mt-3" />
          </div>
        </section>

        {/* Skeleton for Main Content */}
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-72 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(5).fill(0).map((_, index) => (
              <Card className="flex flex-col" key={index}>
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
        <footer className="py-8 text-center text-muted-foreground bg-background border-t">
            <div className="mb-4 flex items-center justify-center gap-4">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Skeleton className="h-4 w-64 mx-auto" />
        </footer>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 dark:bg-muted/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <MilestoneMapperIcon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              <h1 className="text-4xl md:text-6xl font-headline tracking-tight text-primary">Milestone Mapper</h1>
            </div>
            <p className="mt-4 text-lg md:text-2xl text-muted-foreground font-body max-w-3xl mx-auto">
              Your personal atlas of achievements. Track your journeys, from states and countries to stadiums and national parks.
            </p>
            <p className="mt-2 text-base md:text-lg text-muted-foreground/80 font-body">
              Where have you been? Where will you go next?
            </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-headline text-center mb-10">Your Progress Trackers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
       <footer className="py-8 text-center text-muted-foreground border-t">
         <div className="mb-4 flex items-center justify-center gap-4">
          <AuthButton />
          <ThemeToggle />
        </div>
        <p>&copy; {new Date().getFullYear()} Milestone Mapper. Happy travels!</p>
      </footer>
    </main>
  );
}
