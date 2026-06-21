import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Strapi',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${API_URL}/api/auth/local`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const message =
            data?.error?.message || data?.message || 'Invalid credentials';
          throw new Error(message);
        }

        return {
          id: data.user.id.toString(),
          name: data.user.username,
          email: data.user.email,
          token: data.jwt,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        (token as any).token = (user as any).token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.token = token.token;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
