
"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { GlobeIcon, StarIcon, MountainIcon, BaseballIcon, FootballIcon, MilestoneMapperIcon } from "@/components/icons";
import { CountryTracker } from "@/components/trackers/CountryTracker";
import { StateTracker } from "@/components/trackers/StateTracker";
import { NationalParkTracker } from "@/components/trackers/NationalParkTracker";
import { MlbStadiumTracker } from "@/components/trackers/MlbStadiumTracker";
import { NflStadiumTracker } from "@/components/trackers/NflStadiumTracker";
import * as data from "@/lib/data";
import { useTravelData } from "@/hooks/useTravelData";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { getVisitedCount, isLoaded } = useTravelData();

  const categories = [
    {
      slug: 'countries',
      title: "Countries",
      icon: GlobeIcon,
      totalCount: data.countries.length, // Adjust if using a more complete list
      data: data.countries,
      TrackerComponent: CountryTracker,
      cardColor: "text-blue-500",
    },
    {
      slug: 'us-states',
      title: "U.S. States",
      icon: StarIcon,
      totalCount: data.usStates.length, // Should be 50
      data: data.usStates,
      TrackerComponent: StateTracker,
      cardColor: "text-red-500",
    },
    {
      slug: 'national-parks',
      title: "National Parks",
      icon: MountainIcon,
      totalCount: data.nationalParks.length, // Should be 63
      data: data.nationalParks,
      TrackerComponent: NationalParkTracker,
      cardColor: "text-green-600",
    },
    {
      slug: 'mlb-ballparks',
      title: "MLB Ballparks",
      icon: BaseballIcon,
      totalCount: data.mlbBallparks.length, // Should be 30
      data: data.mlbBallparks,
      TrackerComponent: MlbStadiumTracker,
      cardColor: "text-orange-500",
    },
    {
      slug: 'nfl-stadiums',
      title: "NFL Stadiums",
      icon: FootballIcon,
      totalCount: data.nflStadiums.length, // Should be ~30-32
      data: data.nflStadiums,
      TrackerComponent: NflStadiumTracker,
      cardColor: "text-purple-500",
    },
  ] as const; // Use 'as const' for better type inference of slugs

  if (!isLoaded) {
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
          {categories.map(category => (
            <CategoryCard
              key={category.slug}
              title={category.title}
              icon={category.icon}
              visitedCount={getVisitedCount(category.slug)}
              totalCount={category.totalCount}
              cardColor={category.cardColor}
            >
              <category.TrackerComponent {...{[category.slug === 'us-states' ? 'states' : category.slug === 'national-parks' ? 'parks' : category.slug.replace('-', '')]: category.data}} />
            </CategoryCard>
          ))}
        </div>
      </div>
       <footer className="py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Milestone Mapper. Happy travels!</p>
      </footer>
    </main>
  );
}

// Helper types for CardHeader and Card (replace with actual imports if needed)
// These are usually part of shadcn/ui components
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

