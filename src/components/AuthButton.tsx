
"use client";

import { Button } from './ui/button';

export function AuthButton() {

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // A hard refresh is more reliable for ensuring the server
      // re-renders and can read the new session cookie.
      window.location.href = '/';
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
