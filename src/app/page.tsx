
import { cookies } from 'next/headers';
import { Dashboard } from '@/components/Dashboard';
import { LandingPage } from '@/components/LandingPage';

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('session_token');
  const isAuthenticated = !!sessionToken?.value;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
