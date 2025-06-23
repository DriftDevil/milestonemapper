
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

                // If the response is not OK (e.g., 401 Unauthorized, 500 Server Error),
                // it's a failed login attempt. NextAuth handles this by redirecting.
                if (!res.ok) {
                  return null;
                }

                const data = await res.json();

                // If the response is OK but doesn't have the expected user/token data, it's still a failure.
                if (!data?.id || !data?.accessToken) {
                  console.error(
                    `[NextAuth] Invalid success response structure from API:`,
                    data
                  );
                  return null;
                }

                // Construct the user object for next-auth from the API response
                // This object is passed to the 'jwt' callback.
                const user = {
                  id: data.id.toString(), // Ensure id is a string for next-auth
                  email: data.email,
                  name: data.name,
                  username: data.preferredUsername, // Map preferredUsername to username
                  isAdmin: data.isAdmin,
                  jwt: data.accessToken, // Map accessToken to jwt
                };
                
                return user;

              } catch (error: any) {
                // This will catch network errors or if res.json() fails to parse
                console.error(`[NextAuth] Authorization error:`, error.message);
                return null;
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // The 'user' object is only available on initial sign-in.
      // We persist its data to the token.
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.isAdmin = (user as any).isAdmin;
        token.jwt = (user as any).jwt;
      }
      return token;
    },
    async session({ session, token }) {
      // The session callback receives the token from the jwt callback.
      // We add the custom properties to the session object here.
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).isAdmin = token.isAdmin;
      }
       if (token.jwt) {
          (session as any).jwt = token.jwt;
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
