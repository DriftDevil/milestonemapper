
'use server';

import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
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
            console.error(`[NextAuth] API Error: ${res.status} ${res.statusText}`);
            return null;
          }

          const data = await res.json();

          if (!data?.id || !data?.accessToken) {
            console.error(`[NextAuth] Invalid success response structure from API:`, data);
            return null;
          }
          
          const user: User = {
            id: data.id.toString(),
            email: data.email,
            name: data.name,
            username: data.preferredUsername,
            isAdmin: data.isAdmin,
            jwt: data.accessToken,
          };
          
          return user;

        } catch (error) {
          console.error(`[NextAuth] Authorization fetch error:`, error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // The `user` object is only passed on the initial sign-in.
      if (user) {
        // Persist the custom data from the user object to the token.
        return {
          ...token,
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          jwt: user.jwt,
        };
      }
      // On subsequent requests, the token is returned as-is.
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }) {
      // We pass the custom data from the token to the session object.
      // Add extra checks to prevent crashes.
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.jwt = token.jwt as string;
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
