
'use server';

import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';

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

                if (!res.ok) {
                  // Log the error for debugging but return null to the client
                  console.error(`[NextAuth] API Error: ${res.status} ${res.statusText}`);
                  return null;
                }

                const data = await res.json();

                if (!data?.id || !data?.accessToken) {
                  console.error(`[NextAuth] Invalid success response structure from API:`, data);
                  return null;
                }

                // Construct the user object for next-auth from the API response
                // This object must match the augmented `User` type in `next-auth.d.ts`
                const user: User = {
                  id: data.id.toString(),
                  email: data.email,
                  name: data.name,
                  username: data.preferredUsername,
                  isAdmin: data.isAdmin,
                  jwt: data.accessToken,
                };
                
                return user;

              } catch (error: any) {
                // Catches network errors or if res.json() fails to parse
                console.error(`[NextAuth] Authorization fetch error:`, error.message);
                return null;
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, the `user` object from `authorize` is available.
      // We persist its properties to the token.
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
        token.jwt = user.jwt;
        // Default properties like name and email are automatically handled by next-auth
      }
      return token;
    },
    async session({ session, token }) {
      // The session callback receives the token from the jwt callback.
      // We add the custom properties to the session object here.
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }
      if (token.jwt) {
        session.jwt = token.jwt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
