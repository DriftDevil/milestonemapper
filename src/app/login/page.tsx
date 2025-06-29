
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MilestoneMapperIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{title: string, description?: string} | null>(null);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/password-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // On success, redirect to the main page.
        // A hard refresh is more reliable for ensuring the server
        // re-renders and can read the new session cookie.
        window.location.href = '/';
      } else {
        setError({
          title: data.message || 'Login Failed',
          description: data.details || 'An unexpected error occurred. Please try again.'
        });
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      setError({
        title: 'Connection Error',
        description: 'Could not connect to the server. Please check your network and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 mb-2 justify-center">
            <MilestoneMapperIcon className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          </div>
          <CardDescription>Enter your credentials to access your map.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLocalLogin} method="POST">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
             {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>{error.title}</AlertTitle>
                {error.description && <AlertDescription>{error.description}</AlertDescription>}
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Link href="/" className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors">
        &larr; Back to Homepage
      </Link>
    </div>
  );
}
