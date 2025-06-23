
import type { DefaultSession, User as DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session to add custom properties.
   */
  interface Session {
    user: {
      id: string;
      username: string;
      isAdmin: boolean;
    } & DefaultSession['user']; // Keep the default properties
    jwt: string; // Add the JWT to the session
  }

  /**
   * Extends the built-in user to add custom properties.
   * This type is used as the return value from the `authorize` callback.
   */
  interface User extends DefaultUser {
    username: string;
    isAdmin: boolean;
    jwt: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT to add custom properties.
   * This type is used in the `jwt` callback.
   */
  interface JWT {
    id: string;
    username: string;
    isAdmin: boolean;
    jwt: string;
  }
}
