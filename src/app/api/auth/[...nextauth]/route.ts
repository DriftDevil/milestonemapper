
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
          
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              return { ...data.user, jwt: data.jwt };
            }
          }
          
          // If the response is not ok, or if data.user is missing
          // Try to parse the error message from the response body
          try {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || 'Invalid credentials.');
          } catch (e) {
            // If parsing the error fails (e.g., body is not JSON), throw a generic error.
            throw new Error(`Server responded with ${res.status}. Please try again later.`);
          }

        } catch (error: any) {
          // This catches network errors or errors thrown from the block above.
          throw new Error(error.message || 'Login failed. Could not connect to the server.');
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
