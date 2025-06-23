
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function AuthButton() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <Avatar className="h-8 w-8">
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Welcome, {user.username}</span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
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
