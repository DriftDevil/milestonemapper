
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

                const responseText = await res.text();
                let data;
                try {
                  data = JSON.parse(responseText);
                } catch (e) {
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

                if (!res.ok) {
                  const errorMessage =
                    data?.message || data?.error?.message || 'Invalid credentials. Please try again.';
                  throw new Error(errorMessage);
                }

                // If the response is OK but doesn't have the expected user/token data, it's still an error.
                if (!data?.id || !data?.accessToken) {
                  console.error(
                    `[NextAuth] Invalid success response structure from API:`,
                    data
                  );
                  throw new Error(
                    'Authentication succeeded but required user data (id, accessToken) is missing.'
                  );
                }

                // Construct the user object for next-auth from the API response
                const user = {
                  id: data.id,
                  email: data.email,
                  name: data.name,
                  username: data.preferredUsername, // Map preferredUsername to username
                  isAdmin: data.isAdmin,
                  jwt: data.accessToken, // Map accessToken to jwt
                };
                
                return user;

              } catch (error: any) {
                console.error(`[NextAuth] Authorization error:`, error.message);
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
    async jwt({ token, user }) {
      if (user) {
        // This is only called on initial sign in
        token.id = user.id;
        token.username = (user as any).username;
        token.isAdmin = (user as any).isAdmin;
        token.jwt = (user as any).jwt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).isAdmin = token.isAdmin;
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
