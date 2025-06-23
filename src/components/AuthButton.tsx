
"use client";

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function AuthButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Redirect to login page regardless of API call success
      router.push('/login');
      router.refresh(); // Force a full refresh to clear server-side state
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
