
"use client";

import { useState, useEffect } from 'react';
import type { CategorySlug, Country as CountryType, TrackableItem } from '@/types';
import { CategoryCard } from "@/components/CategoryCard";
import { GlobeIcon, StarIcon, MountainIcon, BaseballIcon, FootballIcon, MilestoneMapperIcon } from "@/components/icons";
import { CountryTracker } from "@/components/trackers/CountryTracker";
import { StateTracker } from "@/components/trackers/StateTracker";
import { NationalParkTracker } from "@/components/trackers/NationalParkTracker";
import { MlbStadiumTracker } from "@/components/trackers/MlbStadiumTracker";
import { NflStadiumTracker } from "@/components/trackers/NflStadiumTracker";
import * as localData from "@/lib/data";
import { useTravelData } from "@/hooks/useTravelData";
import { Skeleton } from "@/components/ui/skeleton";

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
    totalCount: 0, // Updated after fetch
    data: [] as CountryType[], // Updated after fetch
    TrackerComponent: CountryTracker,
    cardColor: "text-blue-500",
  },
  {
    slug: 'us-states',
    title: "U.S. States",
    icon: StarIcon,
    totalCount: localData.usStates.length,
    data: localData.usStates,
    TrackerComponent: StateTracker,
    cardColor: "text-red-500",
  },
  {
    slug: 'national-parks',
    title: "National Parks",
    icon: MountainIcon,
    totalCount: localData.nationalParks.length,
    data: localData.nationalParks,
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
  const { getVisitedCount, isLoaded: travelDataLoaded } = useTravelData();
  const [categories, setCategories] = useState<CategoryConfig[]>(initialCategories);
  const [countriesLoading, setCountriesLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawCountries: Array<{ name: { common: string }, cca2: string }> = await response.json();
        const formattedCountries: CountryType[] = rawCountries
          .map(country => ({
            id: country.cca2,
            name: country.name.common,
            code: country.cca2,
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

    fetchCountries();
  }, []);

  const overallLoading = !travelDataLoaded || countriesLoading;

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
            // Prepare props for the TrackerComponent
            let trackerProps = {};
            if (category.slug === 'countries') trackerProps = { countries: category.data };
            else if (category.slug === 'us-states') trackerProps = { states: category.data };
            else if (category.slug === 'national-parks') trackerProps = { parks: category.data };
            else if (category.slug === 'mlb-ballparks') trackerProps = { stadiums: category.data };
            else if (category.slug === 'nfl-stadiums') trackerProps = { stadiums: category.data };

            return (
              <CategoryCard
                key={category.slug}
                title={category.title}
                icon={category.icon}
                visitedCount={getVisitedCount(category.slug)}
                totalCount={category.totalCount}
                cardColor={category.cardColor}
                // You could pass category.error here if CategoryCard is updated to display it
              >
                {category.error ? <p className="text-destructive text-center p-4">{category.error}</p> : <category.TrackerComponent {...trackerProps} />}
              </CategoryCard>
            );
          })}
        </div>
      </div>
       <footer className="py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Milestone Mapper. Happy travels!</p>
      </footer>
    </main>
  );
}

// Helper components (Card, CardHeader, CardContent, CardFooter)
// These are usually part of shadcn/ui components, ensure they are imported if not defined locally.
// For this example, assuming they are available as before or through actual shadcn/ui imports.

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
