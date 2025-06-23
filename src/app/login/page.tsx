
"use client";

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MilestoneMapperIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const callbackError = searchParams.get('error');
    if (callbackError) {
      // Handle errors passed in the URL, e.g., from server-side redirects
      setError("Authentication failed. Please check your credentials and try again.");
    }
  }, [searchParams]);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors on a new attempt

    const result = await signIn('credentials', {
      redirect: false, // We handle the redirect manually to show errors
      identifier,
      password,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/'); // On success, navigate to the main page
    } else {
      // For security, show a generic message for any kind of credential failure.
      // `result.error` often contains internal keys like "CredentialsSignin" which aren't user-friendly.
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 mb-2 justify-center">
            <MilestoneMapperIcon className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          </div>
          <CardDescription>Enter your credentials to access your map.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLocalLogin}>
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
                <AlertDescription>{error}</AlertDescription>
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
    </div>
  );
}
