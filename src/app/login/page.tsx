
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MilestoneMapperIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(callbackError ? "Authentication failed. Please try again." : null);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/');
    } else {
      setError(result?.error || 'Invalid credentials. Please try again.');
    }
  };

  // OIDC login temporarily disabled to fix build error
  // const handleOidcLogin = () => {
  //   setLoading(true);
  //   // The string 'oidc' must match the `id` of the OIDCProvider in the next-auth options
  //   signIn('oidc'); 
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 mb-2 justify-center">
            <MilestoneMapperIcon className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Milestone Mapper</CardTitle>
          </div>
          <CardDescription>Sign in to your account</CardDescription>
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
