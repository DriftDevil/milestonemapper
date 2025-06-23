
"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-9 w-24" />;
  }

  if (session?.user) {
    const username = (session.user as any)?.username || session.user.name || session.user.email;
    const fallback = username?.charAt(0).toUpperCase() || 'U';

    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <Avatar className="h-8 w-8">
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Welcome, {username}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">Sign In</Link>
    </Button>
  );
}
