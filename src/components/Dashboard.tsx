
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CategorySlug, Country as CountryType, USState as USStateType, NationalPark as NationalParkType, TrackableItem, MLBStadium, NFLStadium } from '@/types';
import { CategoryCard } from "@/components/CategoryCard";
import { GlobeIcon, UsaFlagIcon, MountainIcon, BaseballIcon, FootballIcon, MilestoneMapperIcon } from "@/components/icons";
import { CountryTracker } from "@/components/trackers/CountryTracker";
import { StateTracker } from "@/components/trackers/StateTracker";
import { NationalParkTracker } from "@/components/trackers/NationalParkTracker";
import { MlbStadiumTracker } from "@/components/trackers/MlbStadiumTracker";
import { NflStadiumTracker } from "@/components/trackers/NflStadiumTracker";
import { useTravelData } from "@/hooks/useTravelData";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from '@/components/UserNav';

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

// Data for categories that are stored locally
const initialCategories: CategoryConfig[] = [
  {
    slug: 'countries',
    title: "Countries",
    icon: GlobeIcon,
    totalCount: 0, // Will be fetched
    data: [] as CountryType[], // Will be fetched
    TrackerComponent: CountryTracker,
    cardColor: "text-blue-500",
  },
  {
    slug: 'us-states',
    title: "U.S. States",
    icon: UsaFlagIcon,
    totalCount: 0, // Will be fetched
    data: [] as USStateType[], // will be fetched
    TrackerComponent: StateTracker,
    cardColor: "text-red-500",
  },
  {
    slug: 'national-parks',
    title: "National Parks",
    icon: MountainIcon,
    totalCount: 0, // Will be fetched
    data: [] as NationalParkType[], // Will be fetched
    TrackerComponent: NationalParkTracker,
    cardColor: "text-green-600",
  },
  {
    slug: 'mlb-ballparks',
    title: "MLB Ballparks",
    icon: BaseballIcon,
    totalCount: 0, // Will be fetched
    data: [] as MLBStadium[], // Will be fetched
    TrackerComponent: MlbStadiumTracker,
    cardColor: "text-orange-500",
  },
  {
    slug: 'nfl-stadiums',
    title: "NFL Stadiums",
    icon: FootballIcon,
    totalCount: 0,
    data: [] as NFLStadium[],
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
  const [parksLoading, setParksLoading] = useState(true);
  const [ballparksLoading, setBallparksLoading] = useState(true);
  const [nflStadiumsLoading, setNflStadiumsLoading] = useState(true);

  useEffect(() => {
      async function fetchCountries() {
        try {
          const allCountriesRes = await fetch('/api/countries');

          if (!allCountriesRes.ok) {
            const errorBody = await allCountriesRes.text();
            throw new Error(`API error! status: ${allCountriesRes.status}, body: ${errorBody}`);
          }
          
          const allCountriesData: CountryType[] = await allCountriesRes.json();
          
          const sortedCountries = allCountriesData.sort((a, b) => a.name.localeCompare(b.name));

          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'countries'
                ? { ...cat, data: sortedCountries, totalCount: sortedCountries.length, error: undefined }
                : cat
            )
          );
        } catch (error: any) {
          console.error("Failed to fetch countries:", error.message);
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'countries'
                ? { ...cat, data: [], totalCount: 0, error: "Failed to load country data. Please try again later." }
                : cat
            )
          );
        } finally {
          setCountriesLoading(false);
        }
      }

      async function fetchStates() {
        try {
          const allStatesRes = await fetch('/api/us-states');

          if (!allStatesRes.ok) {
            const errorBody = await allStatesRes.text();
            throw new Error(errorBody || `API error! status: ${allStatesRes.status}`);
          }
          
          const allStatesData: USStateType[] = await allStatesRes.json();
          
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'us-states'
                ? { ...cat, data: allStatesData, totalCount: allStatesData.length, error: undefined }
                : cat
            )
          );
        } catch (error: any) {
          console.error("Failed to fetch US states:", error.message);
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'us-states'
                ? { ...cat, data: [], totalCount: 0, error: `Failed to load U.S. States data. Please try again later. (${error.message})` }
                : cat
            )
          );
        } finally {
          setStatesLoading(false);
        }
      }

      async function fetchNationalParks() {
        try {
          const allParksRes = await fetch('/api/national-parks');

          if (!allParksRes.ok) {
            const errorBody = await allParksRes.text();
            throw new Error(`API error! status: ${allParksRes.status}, body: ${errorBody}`);
          }
          
          const allParksData: NationalParkType[] = await allParksRes.json();

          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'national-parks'
                ? { ...cat, data: allParksData, totalCount: allParksData.length, error: undefined }
                : cat
            )
          );
        } catch (error: any) {
          console.error("Failed to fetch national parks:", error.message);
          setCategories(prevCategories =>
            prevCategories.map(cat =>
              cat.slug === 'national-parks'
                ? { ...cat, data: [], totalCount: 0, error: "Failed to load National Park data. Please try again later." }
                : cat
            )
          );
        } finally {
          setParksLoading(false);
        }
      }

      async function fetchBallparks() {
        try {
          const res = await fetch('/api/ballparks');
          if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`API error! status: ${res.status}, body: ${errorBody}`);
          }
          const data: MLBStadium[] = await res.json();
          setCategories(prev => 
            prev.map(cat => cat.slug === 'mlb-ballparks' ? { ...cat, data, totalCount: data.length, error: undefined } : cat)
          );
        } catch (error: any) {
           console.error("Failed to fetch MLB ballparks:", error.message);
           setCategories(prev => 
            prev.map(cat => cat.slug === 'mlb-ballparks' ? { ...cat, data: [], totalCount: 0, error: "Failed to load ballpark data. Please try again later." } : cat)
          );
        } finally {
          setBallparksLoading(false);
        }
      }

      async function fetchNflStadiums() {
        try {
          const res = await fetch('/api/nfl-stadiums');
          if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`API error! status: ${res.status}, body: ${errorBody}`);
          }
          const data: NFLStadium[] = await res.json();
          setCategories(prev => 
            prev.map(cat => cat.slug === 'nfl-stadiums' ? { ...cat, data, totalCount: data.length, error: undefined } : cat)
          );
        } catch (error: any) {
           console.error("Failed to fetch NFL stadiums:", error.message);
           setCategories(prev => 
            prev.map(cat => cat.slug === 'nfl-stadiums' ? { ...cat, data: [], totalCount: 0, error: "Failed to load stadium data. Please try again later." } : cat)
          );
        } finally {
          setNflStadiumsLoading(false);
        }
      }

      fetchCountries();
      fetchStates();
      fetchNationalParks();
      fetchBallparks();
      fetchNflStadiums();
  }, []);

  const overallLoading = !travelDataLoaded || countriesLoading || statesLoading || parksLoading || ballparksLoading || nflStadiumsLoading;

  if (overallLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-6 w-40 hidden sm:block" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </header>
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
        </main>
        <footer className="py-8 text-center text-muted-foreground bg-background border-t">
            <Skeleton className="h-4 w-64 mx-auto" />
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Milestone Mapper Home">
            <MilestoneMapperIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-headline hidden sm:inline-block">Milestone Mapper</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-grow">
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
              const visitedCount = getVisitedCount(category.slug);
              const trackerSpecificProps: any = {
                isItemVisited: isItemVisited,
                toggleItemVisited: toggleItemVisited,
                categorySlug: category.slug,
                clearCategoryVisited: clearCategoryVisited,
              };

              if (category.slug === 'countries') {
                trackerSpecificProps.countries = category.data;
                trackerSpecificProps.visitedCount = visitedCount;
              }
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
                  visitedCount={visitedCount}
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
          <p>&copy; {new Date().getFullYear()} Milestone Mapper. Happy travels!</p>
        </footer>
      </main>
    </div>
  );
}
