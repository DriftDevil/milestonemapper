
'use server';

import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import type { Provider } from 'next-auth/providers/index';
// import OIDCProvider from 'next-auth/providers/oidc'; // Temporarily removed to fix build error
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from '@/types';

const providers: Provider[] = [];

// // Conditionally add the OIDC provider if all its environment variables are set.
// // Temporarily disabled to resolve a persistent "Module not found" build error.
// // This indicates an issue with the node_modules installation.
// if (process.env.OIDC_CLIENT_ID && process.env.OIDC_CLIENT_SECRET && process.env.OIDC_ISSUER) {
//   providers.push(
//     OIDCProvider({
//       id: 'oidc',
//       name: "Authentik",
//       clientId: process.env.OIDC_CLIENT_ID,
//       clientSecret: process.env.OIDC_CLIENT_SECRET,
//       issuer: process.env.OIDC_ISSUER,
//       wellKnown: `${process.env.OIDC_ISSUER}/.well-known/openid-configuration`,
//       authorization: { params: { scope: "openid email profile" } },
//       idToken: true,
//       checks: ['pkce', 'state'],
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.preferred_username || profile.name,
//           email: profile.email,
//           image: profile.picture,
//           username: profile.preferred_username || profile.name,
//         };
//       },
//     })
//   );
// }

// Conditionally add the Credentials provider if its environment variable is set.
if (process.env.NEXT_PUBLIC_API_URL) {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/local/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });
          
          // Read the response body once, regardless of status, to avoid "body already consumed" errors.
          // Gracefully handle cases where the response is not valid JSON.
          const data = await res.json().catch(() => null);

          // If the response was not OK, or if we couldn't get user data, throw an error.
          // next-auth will catch this and pass the message to the login page.
          if (!res.ok || !data?.user || !data?.jwt) {
            const errorMessage = data?.error?.message || 'Invalid credentials. Please try again.';
            throw new Error(errorMessage);
          }

          // The response was successful and contains the expected data.
          // Attach the JWT to the user object that next-auth will use.
          return { ...data.user, jwt: data.jwt };

        } catch (error: any) {
          // This catches both network errors and the errors thrown from the block above.
          // We re-throw it so next-auth can handle it and display it on the login page.
          throw new Error(error.message || 'An unexpected error occurred during login.');
        }
      }
    })
  );
}


export const authOptions: AuthOptions = {
  providers: providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) { // This is only called on initial sign in
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
