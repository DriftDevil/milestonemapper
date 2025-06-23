
'use server';

import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from '@/types';

export const authOptions: AuthOptions = {
  providers: [
    // Conditionally add the Credentials provider if its environment variable is set.
    // This check prevents the app from crashing if the API URL is not configured.
    ...(process.env.NEXT_PUBLIC_API_URL
      ? [
          CredentialsProvider({
            name: 'Credentials',
            credentials: {
              identifier: { label: 'Email or Username', type: 'text' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              if (!credentials?.identifier || !credentials?.password) {
                return null;
              }

              const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/local/login`;

              try {
                const res = await fetch(loginUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    identifier: credentials.identifier,
                    password: credentials.password,
                  }),
                });

                // Read the response body once to avoid "body already consumed" errors.
                const responseText = await res.text();
                let data;
                try {
                  data = JSON.parse(responseText);
                } catch (e) {
                  // The API returned non-JSON. This is an error.
                  console.error(
                    `[NextAuth] Non-JSON response from API: ${responseText.substring(
                      0,
                      100
                    )}...`
                  );
                  throw new Error(
                    'The server returned an unexpected response. Please try again.'
                  );
                }

                // If the response was not OK (e.g., 401, 403, 500), throw an error with the message from the API.
                if (!res.ok) {
                  const errorMessage =
                    data?.error?.message ||
                    'Invalid credentials. Please try again.';
                  throw new Error(errorMessage);
                }

                // If the response is OK but doesn't have the expected user/jwt data, it's still an error.
                if (!data?.user || !data?.jwt) {
                  console.error(
                    `[NextAuth] Invalid success response structure from API:`,
                    data
                  );
                  throw new Error(
                    'Authentication succeeded but user data is missing.'
                  );
                }

                // The response was successful and contains the expected data.
                // Attach the JWT to the user object that next-auth will use.
                return { ...data.user, jwt: data.jwt };
              } catch (error: any) {
                // This catches network errors (e.g., fetch failed) and errors thrown from the block above.
                console.error(`[NextAuth] Authorization error:`, error.message);
                // We re-throw it so next-auth can handle it and display it on the login page.
                // Use the error's message if available, otherwise a generic one.
                throw new Error(
                  error.message ||
                    'An unexpected error occurred during login.'
                );
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // This is only called on initial sign in
        token.id = user.id;
        token.username = (user as User).username;

        if (account?.provider === 'credentials') {
          token.jwt = (user as any).jwt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        if (token.jwt) {
          (session as any).jwt = token.jwt;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
