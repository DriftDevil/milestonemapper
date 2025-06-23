
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MilestoneMapperIcon, GlobeIcon, MountainIcon, TrophyIcon } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" aria-label="Milestone Mapper Home">
          <MilestoneMapperIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">Milestone Mapper</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Sign In</Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-muted/30 dark:bg-muted/10 border-b">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-headline tracking-tight text-primary">Your Journeys, Beautifully Mapped.</h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your travels across countries, U.S. states, national parks, and sports stadiums. Visualize your progress and plan your next adventure with Milestone Mapper.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/login">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-headline">All Your Milestones in One Place</h3>
              <p className="text-muted-foreground mt-2">From global expeditions to local ballgames.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <GlobeIcon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Track the World</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mark off every country you've visited on an interactive world map. See your global footprint grow.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <MountainIcon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Explore Nature</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Log your visits to every U.S. National Park. Record visit dates and cherish your memories in the great outdoors.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <TrophyIcon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Cheer on Your Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">For the ultimate sports fan. Track every MLB and NFL stadium you've been to and complete your collection.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

         {/* Visual Section */}
        <section className="bg-muted/30 dark:bg-muted/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
             <div className="text-center mb-12">
              <h3 className="text-3xl font-headline">Visualize Your Progress</h3>
              <p className="text-muted-foreground mt-2">Interactive maps and progress bars make tracking fun.</p>
            </div>
            <div className="relative w-full max-w-4xl mx-auto">
               <Image
                  src="https://placehold.co/1200x750.png"
                  alt="Milestone Mapper Dashboard Screenshot"
                  width={1200}
                  height={750}
                  className="rounded-lg shadow-2xl border"
                  data-ai-hint="dashboard map"
               />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Milestone Mapper. Built for adventurers.</p>
      </footer>
    </div>
  );
}
