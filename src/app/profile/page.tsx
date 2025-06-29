"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MilestoneMapperIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserNav } from '@/components/UserNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { User } from '@/types';
import { UserCircle } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

function ProfileDetailRow({ label, value }: { label: string, value: string | undefined }) {
  return (
    <div className="flex flex-col space-y-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground sm:text-right">{value || 'N/A'}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error: ${res.status}`);
        }
        const userData: User = await res.json();
        setUser(userData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
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
        <main className="flex-grow bg-muted/40">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-72 mb-10" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="flex flex-col items-center p-6 gap-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-52" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                           <div key={i} className="flex justify-between py-3">
                               <Skeleton className="h-5 w-24" />
                               <Skeleton className="h-5 w-48" />
                           </div>
                        ))}
                    </div>
                    <Separator className="my-6" />
                     <Skeleton className="h-6 w-20 mb-4" />
                     <div className="flex gap-4">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                     </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
       <div className="flex flex-col min-h-screen">
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
          <main className="flex-grow flex items-center justify-center bg-muted/40">
            <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Error Loading Profile</AlertTitle>
                <AlertDescription>{error || "An unknown error occurred."}</AlertDescription>
                 <Button asChild variant="link" className="p-0 h-auto mt-2">
                    <Link href="/">
                       Return to Dashboard
                    </Link>
                </Button>
            </Alert>
          </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
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
          <div className="container mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-headline flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-primary" />
                    User Profile
                </h1>
                <p className="text-muted-foreground">Manage your profile information and settings.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="flex flex-col items-center p-6 text-center gap-4">
                           <div className="relative h-32 w-32">
                             <Image
                               src={user.data.avatarUrl}
                               alt={`${user.data.name}'s avatar`}
                               fill
                               className="rounded-full object-cover"
                             />
                           </div>
                           <div className="space-y-1">
                             <h2 className="text-2xl font-semibold">{user.data.name}</h2>
                             <p className="text-sm text-muted-foreground">{user.data.email}</p>
                           </div>
                           <div className="flex flex-wrap justify-center gap-2">
                              <Badge variant="outline">Authenticated via: {user.authSource.toUpperCase()}</Badge>
                              {user.data.isAdmin && <Badge variant="secondary">Administrator</Badge>}
                           </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Your personal information. Editing is not yet available.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="divide-y divide-border">
                                <ProfileDetailRow label="Full Name" value={user.data.name} />
                                <ProfileDetailRow label="Email Address" value={user.data.email} />
                                <ProfileDetailRow label="User ID" value={user.data.id} />
                                <ProfileDetailRow label="Authentication Method" value={user.authSource.toUpperCase()} />
                            </dl>
                            <Separator className="my-6" />
                            <h3 className="text-lg font-medium">Actions</h3>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Button disabled>Edit Profile (Coming Soon)</Button>
                                <ChangePasswordDialog />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-8 text-center">
                 <Button asChild variant="link">
                    <Link href="/">
                       &larr; Back to Dashboard
                    </Link>
                </Button>
            </div>
          </div>
      </main>
    </div>
  );
}
