
import { cookies } from 'next/headers';
import { Dashboard } from '@/components/Dashboard';
import { LandingPage } from '@/components/LandingPage';

export default async function Page() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  const isAuthenticated = !!sessionToken?.value;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
